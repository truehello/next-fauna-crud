
// components/edit-form.js

import { useState, useEffect } from 'react';
import Router from 'next/router';
import { gql } from 'graphql-request';
import { useForm } from 'react-hook-form';
//import utilStyles from '../styles/utils.module.css';
import { graphQLClient } from '../utils/graphql-client';

const EditForm = ({ defaultValues, id }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const { handleSubmit, register, reset, errors } = useForm({
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit(async ({ task, completed }) => {
    if (errorMessage) setErrorMessage('');

    const query = gql`
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
      await graphQLClient.request(query, variables);
      Router.push('/');
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
      <form onSubmit={onSubmit} className='' className="flex items-center justify-between py-2">
       
          <label className="inline-flex flex-1 items-center pr-8 font-semibold" >Task
          <input
            className="ml-2 border border-gray-400 bg-gray-200 text-gray-900 w-full rounded p-2 flex-1 block w-full rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            type="text"
            name="task"
            ref={register({ required: 'Task is required' })}
          />
          </label>
          {errors.task && (
            <span role="alert" className=''>
              {errors.task.message}
            </span>
          )}
       

       
          <label className="inline-flex items-center pr-8">Completed
          <input type="checkbox" name="completed" ref={register()} className="h-5 w-5 border border-gray-400 bg-gray-200 text-gray-900 leading-tight rounded ml-2" />
          </label>
          {errors.completed && (
            <span role="alert" className=''>
              {errors.completed.message}
            </span>
          )}
       

        <div className=''>
          <button className="mr-2 rounded-md py-2 px-4 text-gray-100 bg-blue-500 hover:bg-blue-600 focus:outline-none" type="submit">Update</button>
        </div>
      </form>

      {errorMessage && (
        <p role="alert" className=''>
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default EditForm;
