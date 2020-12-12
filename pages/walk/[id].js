import YouTube from 'react-youtube';
import { useRouter } from "next/router";
import useSWR from "swr";
import { gql } from "graphql-request";
import Layout from "../../components/layout";
//import EditForm from "../../components/edit-form";
import { graphQLClient } from "../../utils/graphql-client";
import { getAuthCookie } from "../../utils/auth-cookies";
import TextTruncate from "react-text-truncate";

const Walk = ({ token }) => {
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
        video_url
        video_id
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
  const opts = {
    paddingTop: "56.25%",
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };


  if (error) return <div>failed to load</div>;

  return (
    <Layout>
      {data ? (
        <>
          <h1 className="text-2xl mb-2 font-semibold text-white">
            {data.findVideoByID.name}
          </h1>
          <div className="relative w-full" style={{paddingBottom: '56.6%'}}>
          <YouTube videoId={data.findVideoByID.video_id} opts={opts} className="absolute top-0 left-0" />
          </div>
          <p className="text-gray-100"> {data.findVideoByID.location}</p>
          <p className="text-gray-100"> {data.findVideoByID.city}</p>
          <p className="text-gray-100"> {data.findVideoByID.country}</p>
          <TextTruncate
              line={7}
              element="p"
              truncateText="…"
              text={data.findVideoByID.description}
              className="content-text text-gray-100 tracking-tight"
            />
          
          <p>lat: {data.findVideoByID.latitude}</p>
          <p>lon: {data.findVideoByID.longitude}</p>
          <p className="text-gray-100">date: {data.findVideoByID.date}</p>
        </>
      ) : (
        <div>loading...</div>
      )}

      {isOwner && (
        <button className="px-8 py-2 text-lg font-semibold text-white rounded-lg sm:block bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
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

export default Walk;
