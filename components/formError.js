const formError = ({ message }) => (
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
      class="ml-2 mr-4"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
    {message}
  </span>
);

export default formError;