import useSWR from "swr";
import { gql } from "graphql-request";

import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";
import { getAuthCookie } from "../utils/auth-cookies";
import Hero from "../components/hero";
import WalkCard from "../components/walkCard";

const Home = ({ token }) => {


  const fetcher = async (query) => await graphQLClient(token).request(query);

  const { data: user } = useSWR("/api/user");
  const { data, error } = useSWR(
    gql`
      {
        newestVideos(_size: 4) {
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

//   const {country } = "Japan"
//   const fetcher = async (query) =>
//   await graphQLClient(token).request(query, { country });

// const query = gql`
//   query FindAVideoByCountry($country: String!) {
//     findVideosByCountry(country: $country) {
//       name
//       location
//       city
//       country
//       date
//       latitude
//       longitude
//       image
//       video_url
//       video_id
//       description
//       owner {
//         _id
//       }
//     }
//   }
// `;

//const { data, error } = useSWR([query, country], fetcher);

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
      {/* <Hero /> */}

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
            {data.newestVideos.data.map((video) => (
              <WalkCard data={video} key={video._id} />
            ))}
          </ul>
          <div className="mt-4 flex justify-end px-8">
            {data.newestVideos.after ? (
              <Link
                href="/walks/[id]?id=${data.newestVideos.after}"
                as={`/walks/${data.newestVideos.after}`}
              >
                <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
                  More
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
