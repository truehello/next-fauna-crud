import useSWR from "swr";
import { gql } from "graphql-request";

import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";
import { getAuthCookie } from "../utils/auth-cookies";
import WalkCard from "../components/walkCard";

const Home = ({ token }) => {
  const fetcher = async (query) => await graphQLClient(token).request(query);

  const { data: user } = useSWR("/api/user");
  const { data, error, before, after, mutate } = useSWR(
    gql`
      {
      allVideos(_size: 12 ){
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
    fetcher
  );

  if (error)
    return (
      <Layout>
        <div className="flex items-center justify-center text-white">
          failed to load
        </div>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-2xl py-4 mb-4 font-semibold text-white lowercase">
        WalkFlow
      </h1>
      {/* show add a video link if user is logged in */}
      {user && (
        <Link href="/addVideo">
          <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
            Add a Walk
          </a>
        </Link>
      )}

      {data ? (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {data.allVideos.data.map((video) => (
              <WalkCard data={video} key={video._id} />
            ))}
          </ul>
          <div className="mt-4 flex justify-between px-8">
            {data.allVideos.before ? (
               <Link href="/walks/[id]" as={`/walks/${data.allVideos.before}`}>
                 <a
                className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500"
              >
                Prev
                </a>
              </Link>
            ) : (
              <p>&nbsp;</p>
            )}
            {data.allVideos.after ? (
               <Link href="/walks/[id]" as={`/walks/${data.allVideos.after}`}>
               <a 
                className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500"
              >
                Next
                </a>
              </Link>
            ) : (
              <p>&nbsp;</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-white">
          loading...
        </div>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Home;
