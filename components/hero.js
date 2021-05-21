const Hero = () => (
  <section
    className="max-h-64 w-full rounded-lg p-32 flex flex-col justify-center items-center"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1612970077710-752794ce07ed?crop=entropy&cs=tinysrgb&fit=max')`,
      backgroundSize: `cover`,
    }}
  >
    <h1 className="text-6xl font-semibold lowercase bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
      Walkflow
    </h1>

    <p className="text-gray-100 text-2xl mb-8">
      Stroll Your Way around the World
    </p>

    <div className="container flex text-xl w-4/6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute text-gray-500 h-16 w-16 p-4"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>

      <input
        className="w-full h-16 rounded-l mb-8 pl-16 focus:outline-none focus:shadow-outline px-8 shadow-lg"
        type="search"
        placeholder="Find your adventure..."
      />

      <button
        className="w-2/6 bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500 text-white rounded-r h-16"
        type="button"
      >
        Search
      </button>
    </div>
  </section>
);

export default Hero;
