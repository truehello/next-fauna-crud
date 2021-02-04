import { useRouter } from "next/router";
import useSWR from "swr";
import { gql } from "graphql-request";

import Link from "next/link";
import { graphQLClient } from "../../utils/graphql-client";
import { getAuthCookie } from "../../utils/auth-cookies";
import Layout from "../../components/layout";
import WalkCard from "../../components/walkCard";

const Walks = ({ token }) => {
  const router = useRouter();
  const { data: user } = useSWR("/api/user");

  const { id } = router.query;
  //const { cursor } = "2DOB2DRyMjg3NzM0MDYxMjAxMzU5MzczgWVWaWRlb4FnY2xhc3Nlc4CAgIA="

  console.log("cursor", id)
  const fetcher = async (query) =>
    await graphQLClient(token).request(query, { id });

  const { data, error, before, after, mutate } = useSWR(
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

export default Walks;
