import useSWR from "swr";
import { gql } from "graphql-request";
import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";

const fetcher = async (query) => await graphQLClient.request(query);


const Home = () => {

  const { data, error, mutate } = useSWR(
    gql`
      {
        allTodos {
          data {
            _id
            task
            completed
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
      await graphQLClient.request(query, variables);
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
      await graphQLClient.request(query, { id });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  if (error) return <div>failed to load</div>;

  return (
    <Layout>
      <h1 className="text-2xl mb-2 font-semibold">Next Fauna GraphQL CRUD</h1>

      <Link href="/new">
        <a className="rounded-md py-2 px-4 text-gray-100 bg-green-500 hover:bg-green-600 focus:outline-none">Create New Todo</a>
      </Link>

      {data ? (
        <ul className="my-4">
          {data.allTodos.data.map((todo) => (
            <li key={todo._id} className="flex items-center justify-between py-2">
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
              <div>
              <span className="ml-4">
                <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
                  <a className="rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none">
                    Edit
                  </a>
                </Link>
              </span>
              <span onClick={() => deleteATodo(todo._id)} className="ml-2 rounded-md py-2 px-4 text-gray-100 bg-red-500 hover:bg-red-600 focus:outline-none">
  Delete
</span>
</div>
            </li>
          ))}
        </ul>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
};

export default Home;
