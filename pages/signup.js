import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Layout from "../components/layout";
import FormError from "../components/formError";

const Signup = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const { handleSubmit, register, watch, errors } = useForm();

  const onSubmit = handleSubmit(async (formData) => {
    if (errorMessage) setErrorMessage("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  return (
    <Layout>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-100">
            Sign Up
          </h2>

          <form onSubmit={onSubmit} className="mt-8">
            <div>
              <label className="text-gray-100 leading-loose">Email</label>
              <input
                aria-label="Email address"
                type="email"
                name="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                placeholder="e.g. john@example.com"
                ref={register({ required: "Email is required" })}
              />
              {errors.email && <FormError message={errors.email.message} />}
            </div>

            <div>
              <label className="text-gray-100 leading-loose">Password</label>
              <input
                aria-label="Password"
                type="password"
                name="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                placeholder="e.g. John-1234"
                ref={register({ required: "Password is required" })}
              />
              {errors.password && (
                <FormError message={errors.password.message} />
              )}
            </div>

            <div>
              <label className="text-gray-100 leading-loose">
                Confirm Password
              </label>
              <input
                aria-label="Confirm Password"
                type="password"
                name="password2"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                placeholder="e.g. John-1234"
                ref={register({
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.password2 && (
                <FormError message={errors.password2.message} />
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Sign up
              </button>
            </div>
          </form>

          {errorMessage && <FormError message={errorMessage} />}
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
