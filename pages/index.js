import useSWR from "swr";
import { gql } from "graphql-request";

import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";
import { getAuthCookie } from "../utils/auth-cookies";
import TextTruncate from "react-text-truncate";
import YouTube from "react-youtube";

import WalkCard from "../components/walkCard";



const Home = ({ token }) => {
  const fetcher = async (query) => await graphQLClient(token).request(query);

  const { data: user } = useSWR("/api/user");

  const { data, error, mutate } = useSWR(
    gql`
      {
        allVideos {
          data {
            _id
            name
            video_id
            location
            city
            country
            date
            latitude
            longitude
            image
            description
            owner {
              _id
            }
          }
        }
      }
    `,
    fetcher
  );



  if (error)
    return (
      <Layout>
        <div>failed to load</div>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-2xl py-4 mb-4 font-semibold text-white">Walk Flow</h1>
      {/* show add a video link if user is logged in */}
      {user && (
        <Link href="/addVideo">
          <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
            Add a Video
          </a>
        </Link>
      )}

      {data ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {data.allVideos.data.map((video) => (
            <WalkCard data={video} key={video._id} />
           
          ))}
        </ul>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
};


export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Home;
