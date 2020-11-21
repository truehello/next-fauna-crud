import useSWR from "swr";
import { gql } from "graphql-request";

import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import Link from "next/link";
import { getAuthCookie } from "../utils/auth-cookies";
import TextTruncate from "react-text-truncate";

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

  // const toggleTodo = async (id, completed) => {
  //   const mutation = gql`
  //     mutation PartialUpdateTodo($id: ID!, $completed: Boolean!) {
  //       partialUpdateTodo(id: $id, data: { completed: $completed }) {
  //         _id
  //         completed
  //       }
  //     }
  //   `;

  //   const variables = {
  //     id,
  //     completed: !completed,
  //   };

  //   try {
  //     await graphQLClient(token)
  //       .setHeader("X-Schema-Preview", "partial-update-mutation")
  //       .request(mutation, variables);
  //     mutate();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const deleteATodo = async (id) => {
  //   const mutation = gql`
  //     mutation DeleteATodo($id: ID!) {
  //       deleteTodo(id: $id) {
  //         _id
  //       }
  //     }
  //   `;

  //   try {
  //     await graphQLClient(token).request(mutation, { id });
  //     mutate();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  //console.log(JSON.stringify(data, null, 2))

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
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {data.allVideos.data.map((video) => (
            <li key={video._id} className="p-4 bg-opacity-75 bg-gradient-to-r from-purple-700 to-blue-500 text-gray-100 rounded">
              <p className="text-lg font-semibold">{video.name}</p>
              <p>location: {video.location}</p>
              <p>city: {video.city}</p>
              <p>country: {video.country}</p>
             
              <TextTruncate
              line={3}
              element="p"
              truncateText="…"
              text={video.description}
              className="content-text text-gray-200 tracking-tight"
            />
              <p>date:{video.date}</p>
              
              <p>latitude: {video.latitude}</p>
              <p className="mb-4">longitude: {video.longitude}</p>
              <Link href="/walk/[id]" as={`/walk/${video._id}`}>
                <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
                  Visit
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>loading...</div>
      )}
    </Layout>
  );
};
// return (
//   <Layout>
//     <h1 className="text-2xl py-4 mb-4 font-semibold">ToDo WOOHOO</h1>

//     <Link href="/new">
//       <a className="rounded-md py-2 px-4 text-gray-100 bg-green-500 hover:bg-green-600 focus:outline-none">
//         Create New Todo
//       </a>
//     </Link>

//     <Link href="/addVideo">
//       <a className="rounded-md py-2 px-4 text-yellow-100 bg-yellow-500 hover:bg-yellow-600 focus:outline-none">
//         Add a Video
//       </a>
//     </Link>

//     {data ? (
//       <ul className="my-4">
//         {data.allVideos.data.map((todo) => (
//           <li
//             key={video._id}
//             className="flex items-center justify-between py-4"
//           >
//             <p>{video.name}</p>
//             <p>{video.location}</p>

//             {user && user.id === todo.owner._id ? (
//                <>
//                <span
//                className="text-base font-medium text-gray-700 cursor-pointer"
//                onClick={() => toggleTodo(todo._id, todo.completed)}
//                style={
//                  todo.completed
//                    ? { textDecorationLine: "line-through" }
//                    : { textDecorationLine: "none" }
//                }
//              >
//                {todo.task}
//              </span>

//               <div>
//                 <span className="ml-4">
//                   <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
//                     <a className="rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none">
//                       Edit
//                     </a>
//                   </Link>
//                 </span>
//                 <button
//                   onClick={() => deleteATodo(todo._id)}
//                   className=" ml-2 rounded-md py-2 px-4 text-gray-100 bg-red-500 hover:bg-red-600 focus:outline-none"
//                 >
//                   Delete
//                 </button>
//               </div>
//               </>
//             ) : (
//               <>
//               <span className="text-base font-medium text-gray-700">
//               {todo.task}
//             </span>
//               <Link href="/todo/[id]" as={`/todo/${todo._id}`}>
//                 <a className="rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none">
//                   View
//                 </a>
//               </Link>
//               </>
//             )}

//           </li>
//         ))}
//       </ul>
//     ) : (
//       <div>loading...</div>
//     )}
//   </Layout>
// );
//};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Home;
