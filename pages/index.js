import useSWR from "swr";
import { gql } from "graphql-request";

import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";
import { getAuthCookie } from "../utils/auth-cookies";

const Home = ({ token }) => {
  const fetcher = async (query) => await graphQLClient(token).request(query);

  const { data: user } = useSWR("/api/user");

  const { data, error, mutate } = useSWR(
    gql`
      {
        allTodos {
          data {
            _id
            task
            completed
            owner {
              _id
            }
          }
        }
      }
    `,
    fetcher
  );

  const toggleTodo = async (id, completed) => {
    const query = gql`
      mutation PartialUpdateTodo($id: ID!, $completed: Boolean!) {
        partialUpdateTodo(id: $id, data: { completed: $completed }) {
          _id
          completed
        }
      }
    `;

    const variables = {
      id,
      completed: !completed,
    };

    try {
      await graphQLClient(token)
        .setHeader("X-Schema-Preview", "partial-update-mutation")
        .request(mutation, variables);
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteATodo = async (id) => {
    const query = gql`
      mutation DeleteATodo($id: ID!) {
        deleteTodo(id: $id) {
          _id
        }
      }
    `;

    try {
      await graphQLClient(token).request(mutation, { id });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  if (error)
    return (
      <Layout>
        <div>failed to load</div>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-2xl py-4 mb-4 font-semibold">ToDo WOOHOO</h1>

      <Link href="/new">
        <a className="rounded-md py-2 px-4 text-gray-100 bg-green-500 hover:bg-green-600 focus:outline-none">
          Create New Todo
        </a>
      </Link>

      {data ? (
        <ul className="my-4">
          {data.allTodos.data.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between py-2"
            >
              <span
                className="text-base leading-5 font-medium text-gray-700"
                onClick={() => toggleTodo(todo._id, todo.completed)}
                style={
                  todo.completed
                    ? { textDecorationLine: "line-through" }
                    : { textDecorationLine: "none" }
                }
              >
                {todo.task}
              </span>

              {user && user.id === todo.owner._id ? (
                <div>
                  <span className="ml-4">
                    <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                      <a className="rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none">
                        Edit
                      </a>
                    </Link>
                  </span>
                  <span
                    onClick={() => deleteATodo(todo._id)}
                    className="ml-2 rounded-md py-2 px-4 text-gray-100 bg-red-500 hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </span>
                </div>
              ) : (
                <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                  <a className="rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none">
                    View
                  </a>
                </Link>
              )}
            </li>
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
