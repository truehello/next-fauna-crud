import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import Layout from "../components/layout";
import FormError from "../components/formError";

import { graphQLClient } from "../utils/graphql-client";
import { getAuthCookie } from "../utils/auth-cookies";

const New = ({ token }) => {
  const router = useRouter();

  const { data: user } = useSWR("/api/user");

  const [errorMessage, setErrorMessage] = useState("");

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(
    async ({
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
    }) => {
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
    }
  );

  return (
    <Layout>
      <h1 className="text-gray-100 text-2xl mb-2 font-semibold">
        Add A New Video
      </h1>

      {user ? (
        <form onSubmit={onSubmit} className="form px-6 lg:px-24">
          <div className="mb-4">
            <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
              Name
            </label>
            <input
              className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              type="text"
              name="name"
              placeholder="e.g. name of walk"
              ref={register({ required: "a name is required" })}
            />
            {errors.name && <FormError message={errors.name.message} />}
          </div>

          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Location
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="location"
                placeholder="e.g. location"
                ref={register({ required: "a location is required" })}
              />
              {errors.location && (
                <FormError message={errors.location.message} />
              )}
            </div>

            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Date
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="date"
                placeholder="e.g. date"
                ref={register}
              />
            </div>
          </div>

          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Video URL
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="video_url"
                placeholder="e.g. https://youtube.com/walkabout"
                ref={register({ required: "a video URL is required" })}
              />
              {errors.url && <FormError message={errors.video_url.message} />}
            </div>

            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Video ID
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="video_id"
                placeholder="oe8HC3nTArc"
                ref={register({ required: "a video ID is required" })}
              />
              {errors.url && <FormError message={errors.video_id.message} />}
            </div>
          </div>

          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                City
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="city"
                placeholder="e.g. city"
                ref={register}
              />
            </div>

            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Country
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="country"
                placeholder="e.g. country"
                ref={register}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
              Description
            </label>
            <textarea
              className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              type="text"
              name="description"
              placeholder="e.g. description"
              ref={register}
            />
          </div>

          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Latitude
              </label>
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

            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Longitude
              </label>
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
          </div>

          <div className="md:flex mb-4">
            <div className="md:flex-1 md:pr-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Video Host
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="video_host"
                placeholder="Youtube"
                ref={register}
              />
            </div>

            <div className="md:flex-1 md:pl-3">
              <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
                Credit
              </label>
              <input
                className="border border-gray-400 bg-gray-200 text-gray-900 p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                type="text"
                name="credit"
                placeholder="channel"
                ref={register}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block uppercase tracking-wide text-gray-100 text-xs font-bold">
              Image
            </label>
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
              className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      ) : (
        <div className="text-white">
          Please{" "}
          <Link href="/login">
            <a className="underline hover:no-underline">Login</a>
          </Link>{" "}
          to add a Walk
        </div>
      )}

      {errorMessage && <FormError message={errorMessage.message} />}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default New;
