import { useRouter } from "next/router";
import useSWR from "swr";
import { gql } from "graphql-request";
import Layout from "../../components/layout";
import EditForm from "../../components/edit-form";
import { graphQLClient } from "../../utils/graphql-client";
import { getAuthCookie } from "../../utils/auth-cookies";

const Todo = ({ token }) => {
  const router = useRouter();
  const { data: user } = useSWR("/api/user");

  const { id } = router.query;

  const fetcher = async (query) =>
    await graphQLClient(token).request(query, { id });

  const query = gql`
    query FindATodoByID($id: ID!) {
      findTodoByID(id: $id) {
        task
        completed
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
    const ownerId = data.findTodoByID.owner._id;
    if (ownerId === userId) isOwner = true;
  }

  // console.log(isOwner, isOwner)

  if (error) return <div>failed to load</div>;

  return (
    <Layout>
      {user && <h1 className="text-2xl mb-2 font-semibold">Edit Todo</h1>}
      

      {data ? (
        <>
          {isOwner ? (
            <EditForm defaultValues={data.findTodoByID} id={id} token={token} />
          ) : (
            <p> {data.findTodoByID.task}</p>
          )}
        </>
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

export default Todo;
