import { useState } from "react";
import { useRouter } from "next/router";
//import Router from 'next/router'
import useSWR from "swr";
import { gql } from "graphql-request";
import { useSWRInfinite } from "swr";

import { graphQLClient } from "../../utils/graphql-client";
import { getAuthCookie } from "../../utils/auth-cookies";
import Layout from "../../components/layout";
import WalkList from "../../components/walkList";
import Pagination from "../../components/pagination";
import Link from "next/link";

const Walks = ({ token }) => {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = async (query) =>
    await graphQLClient(token).request(query, { id });

  const { data, error } = useSWR(
    [
      gql`
        query ListVideoByCursor($id: String) {
          allVideos(_size: 8, _cursor: $id) {
            data {
              _id
              name
              video_id
              location
              city
              country
              date
              description
              owner {
                _id
              }
            }
            before
            after
          }
        }
      `,
      id,
    ],
    fetcher
  );

  if (error)
    return (
      <Layout>
        <div className="flex items-center justify-center text-white">
          failed to load {error}
        </div>
      </Layout>
    );


  return (
    <Layout>
      {data ? (
        <>
          <WalkList index={id} data={data.allVideos.data} />
          <Pagination
            before={data.allVideos.before}
            after={data.allVideos.after}
          />
         
        </>
      ) : (
        <div className="flex items-center justify-center text-white">
          loading....
        </div>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Walks;
