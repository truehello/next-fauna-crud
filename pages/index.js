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
        allVideos(_size: 12) {
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
      <section
        className="max-h-64 w-full rounded-lg p-32 flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1612970077710-752794ce07ed?crop=entropy&cs=tinysrgb&fit=max')`,
          backgroundSize: `cover`,
        }}
      >
        <h1 className="text-6xl font-semibold lowercase bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Walkflow
        </h1>

        <p className="text-gray-100 text-2xl mb-8">
          Stroll Your Way around the World
        </p>

        <div className="container flex text-xl w-4/6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="absolute text-gray-500 h-16 w-16 p-4"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          <input
            className="w-full h-16 rounded-l mb-8 pl-16 focus:outline-none focus:shadow-outline px-8 shadow-lg"
            type="search"
            placeholder="Find your adventure..."
          />

          <button
            className="w-2/6 bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500 text-white rounded-r h-16"
            type="button"
          >
            Search
          </button>
        </div>
      </section>

        {/* show add a video link if user is logged in */}
      {user && (
      <div className="p-4 flex justify-between items-center">
      <h1 className="text-2xl py-4 mb-4 font-semibold text-white">
        Welcome back, {user.email}
      </h1>
      
        <Link href="/addVideo">
          <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
            Add a Walk
          </a>
        </Link>
        </div>
      )}

      {data ? (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 lg:px-16">
            {data.allVideos.data.map((video) => (
              <WalkCard data={video} key={video._id} />
            ))}
          </ul>
          <div className="mt-4 flex justify-between px-8">
            {data.allVideos.before ? (
              <Link
                href="/walks/[id]?id=${data.allVideos.before}"
                as={`/walks/${data.allVideos.before}`}
              >
                <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
                  Prev
                </a>
              </Link>
            ) : (
              <p>&nbsp;</p>
            )}
            {data.allVideos.after ? (
              <Link
                href="/walks/[id]?id=${data.allVideos.after}"
                as={`/walks/${data.allVideos.after}`}
              >
                <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
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
