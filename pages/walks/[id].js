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
          allVideos(_size: 4, _cursor: $id) {
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

  if (!data)
    return (
      <Layout>
        <div className="flex items-center justify-center text-white">
          loading....
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
          {/* <button onClick={() => setPageId(data.allVideos.before)}>
            Previous
          </button>

          <Link href={`/walks/[id]`} as={`${data.allVideos.after}`}>
            <a
              onClick={() => setPageId(data.allVideos.after)}
              className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500"
            >
              Next
            </a>
          </Link> */}
        </>
      ) : (
        <p>its not working. Why? </p>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Walks;
