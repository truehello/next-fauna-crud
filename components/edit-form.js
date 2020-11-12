

import { useState, useEffect } from "react";
import Router from "next/router";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import { graphQLClient } from "../utils/graphql-client";

const EditForm = ({ defaultValues, id, token }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const { handleSubmit, register, reset, errors } = useForm({
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit(async ({ task, completed }) => {
    if (errorMessage) setErrorMessage("");

    const mutation = gql`
      mutation UpdateATodo($id: ID!, $task: String!, $completed: Boolean!) {
        updateTodo(id: $id, data: { task: $task, completed: $completed }) {
          task
          completed
        }
      }
    `;

    const variables = {
      id,
      task,
      completed,
    };

    try {
      await graphQLClient(token).request(mutation, variables);
      Router.push("/");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  useEffect(() => {
    reset(defaultValues); // asynchronously reset your form values
  }, [reset, defaultValues]);

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex items-center justify-between py-2"
      >
        <label className="inline-flex flex-1 items-center pr-8 font-semibold">
          Task
          <input
            className="ml-2 border border-gray-400 bg-gray-200 text-gray-900 w-full rounded p-2 flex-1 block  rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="task"
            ref={register({ required: "Task is required" })}
          />
        </label>
        {errors.task && (
          <span
            role="alert"
            className="bg-red-200 shadow-md rounded p-4 mb-4 flex flex-row my-2 text-red-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 mr-4"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {errors.task.message}
          </span>
        )}

        <label className="inline-flex items-center pr-8">
          Completed
          <input
            type="checkbox"
            name="completed"
            ref={register()}
            className="h-5 w-5 border border-gray-400 bg-gray-200 text-gray-900 leading-tight rounded ml-2"
          />
        </label>
        {errors.completed && (
          <span role="alert" className="">
            {errors.completed.message}
          </span>
        )}

        <div className="">
          <button
            className="mr-2 rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>

      {errorMessage && (
        <p
          role="alert"
          className="bg-red-200 shadow-md rounded p-4 mb-4 flex flex-row my-2 text-red-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 mr-4"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default EditForm;
