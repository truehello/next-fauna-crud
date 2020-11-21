import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import Layout from "../components/layout";
import { graphQLClient } from "../utils/graphql-client";
import { getAuthCookie } from "../utils/auth-cookies";

const New = ({ token }) => {
  const router = useRouter();

  const { data: user } = useSWR("/api/user");

  const [errorMessage, setErrorMessage] = useState("");

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async ({ name, city, location, country, description, video_url, video_id, video_host, credit, date, image }) => {
    if (errorMessage) setErrorMessage("");

    const mutation = gql`
      mutation CreateAVideo(
        $name: String!
        $location: String!
        $city: String
        $country: String
        $description: String
        $video_url: String
        $video_id: String
        $video_host: String
        $credit: String
        $date: String
        $image: String
        $owner: ID!
      ) {
        createVideo(
          data: {
            name: $name
            city: $city
            location: $location
            country: $country
            description: $description
            video_url: $video_url
            video_id: $video_id
            video_host: $video_host
            credit: $credit
            date: $date
            image: $image
            owner: { connect: $owner }
          }
        ) {
          name
          city
          location
          country
          description
          video_url
          video_id
          video_host
          credit
          date
          image
          owner {
            _id
          }
        }
      }
    `;

    const variables = {
      name,
      city,
      location,
      country,
      description,
      video_url,
      video_id,
      video_host,
      credit,
      date,
      image,
      owner: user && user.id,
    };

    try {
      await graphQLClient(token).request(mutation, variables);
      router.push("/");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  return (
    <Layout>
      <h1 className="text-2xl mb-2 font-semibold">Add A New Video</h1>

      <form onSubmit={onSubmit} className="form">
        <div>
          <label>Name</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="name"
            placeholder="e.g. name of walk"
            ref={register({ required: "a name is required" })}
          />
          {errors.name && (
            <span
              role="alert"
              className="bg-red-200 shadow-md rounded px-4 py-2 mt-4 text-red-800"
            >
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <label>Location</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="location"
            placeholder="e.g. location"
            ref={register({ required: "a location is required" })}
          />
          {errors.location && (
            <span
              role="alert"
              className="bg-red-200 shadow-md rounded px-4 py-2 mt-4 text-red-800"
            >
              {errors.location.message}
            </span>
          )}
        </div>

        <div>
          <label>Video URL</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="video_url"
            placeholder="e.g. https://youtube.com/walkabout"
            ref={register({ required: "a video URL is required" })}
          />
          {errors.url && (
            <span
              role="alert"
              className="bg-red-200 shadow-md rounded px-4 py-2 mt-4 text-red-800"
            >
              {errors.video_url.message}
            </span>
          )}
        </div>

        <div>
          <label>Video ID</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="video_id"
            placeholder="oe8HC3nTArc"
            ref={register({ required: "a video ID is required" })}
          />
          {errors.url && (
            <span
              role="alert"
              className="bg-red-200 shadow-md rounded px-4 py-2 mt-4 text-red-800"
            >
              {errors.video_id.message}
            </span>
          )}
        </div>

        <div>
          <label>City</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="city"
            placeholder="e.g. city"
            ref={register}
          />
        </div>

        <div>
          <label>Country</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="country"
            placeholder="e.g. country"
            ref={register}
          />
        </div>

        <div>
          <label>Description</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="description"
            placeholder="e.g. description"
            ref={register}
          />
        </div>

        <div>
          <label>Latitude</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="number" 
            step="1" 
            pattern="\d+"
            name="latitude"
            placeholder="e.g. latitude"
            ref={register}
          />
        </div>

        <div>
          <label>Longitude</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="number"
            step="1" 
            pattern="\d+"
            name="longitude"
            placeholder="e.g. longitude"
            ref={register}
          />
        </div>

        <div>
          <label>Date</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="date"
            placeholder="e.g. date"
            ref={register}
          />
        </div>

        <div>
          <label>Video Host</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="video_host"
            placeholder="oe8HC3nTArc"
            ref={register}
          />
        </div>

        <div>
          <label>Credit</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="credit"
            placeholder="oe8HC3nTArc"
            ref={register}
          />
        </div>

        <div>
          <label>Image</label>
          <input
            className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="image"
            placeholder="e.g. image"
            ref={register}
          />
        </div>

        <div className="mt-4">
          <button
            className="rounded-md py-2 px-4 text-gray-100 bg-green-500 hover:bg-green-600 focus:outline-none"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" className="alert error">
          {errorMessage.message}
        </p>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default New;
