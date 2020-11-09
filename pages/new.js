import { useState } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm } from 'react-hook-form';
import Layout from '../components/layout';
import { graphQLClient } from '../utils/graphql-client';

const New = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = handleSubmit(async ({ task }) => {
    if (errorMessage) setErrorMessage('');

    const query = gql`
      mutation CreateATodo($task: String!) {
        createTodo(data: { task: $task, completed: false }) {
          task
          completed
        }
      }
    `;

    try {
      await graphQLClient.request(query, { task });
      Router.push('/');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  });

  return (
    <Layout>
      <h1 className="text-2xl mb-2 font-semibold">Create New Todo</h1>

      <form onSubmit={onSubmit} className='form'>
        <div>
          <label>Task</label>
          <input
          className="border border-gray-400 bg-gray-200 text-gray-900 w-full rounded p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="task"
            placeholder="e.g. do something"
            ref={register({ required: 'Task is required' })}
          />
          {errors.task && (
            <span role="alert" className='bg-red-200 shadow-md rounded px-4 py-2 mt-4 text-red-800'>
              {errors.task.message}
            </span>
          )}
        </div>

        <div className='mt-4'>
          <button className="rounded-md py-2 px-4 text-gray-100 bg-green-500 hover:bg-green-600 focus:outline-none" type="submit">Create</button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" className='alert error'>
          {errorMessage}
        </p>
      )}
    </Layout>
  );
};

export default New;