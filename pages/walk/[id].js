import { useRouter } from "next/router";
import useSWR from "swr";
import { gql } from "graphql-request";
import Layout from "../../components/layout";
//import EditForm from "../../components/edit-form";
import { graphQLClient } from "../../utils/graphql-client";
import { getAuthCookie } from "../../utils/auth-cookies";

const Todo = ({ token }) => {
  const router = useRouter();
  const { data: user } = useSWR("/api/user");

  const { id } = router.query;

  const fetcher = async (query) =>
    await graphQLClient(token).request(query, { id });

  const query = gql`
    query FindAVideoByID($id: ID!) {
      findVideoByID(id: $id) {
        name
        location
        city
        country
        date
        latitude
        longitude
        image
        url
        description
        owner {
          _id
        }
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  let isOwner = false;
  let userId = 0;
  if (user) userId = user.id;

  if (data) {
    const ownerId = data.findVideoByID.owner._id;
    if (ownerId === userId) isOwner = true;
  }

  // console.log(isOwner, isOwner)

  if (error) return <div>failed to load</div>;

  return (
    <Layout>
      {data ? (
        <>
          <h1 className="text-2xl mb-2 font-semibold">
            {data.findVideoByID.name}
          </h1>

          <p> {data.findVideoByID.location}</p>
          <p> {data.findVideoByID.city}</p>
          <p> {data.findVideoByID.country}</p>
          <p> {data.findVideoByID.url}</p>
          <p> {data.findVideoByID.description}</p>
          <p>lat: {data.findVideoByID.latitude}</p>
          <p>lon: {data.findVideoByID.longitude}</p>
          <p>date: {data.findVideoByID.date}</p>
        </>
      ) : (
        <div>loading...</div>
      )}

      {isOwner && (
        <button className="mb-4 rounded-md py-2 px-4 text-yellow-100 bg-yellow-500 hover:bg-yellow-600 focus:outline-none">
          Edit Walk
        </button>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Todo;
