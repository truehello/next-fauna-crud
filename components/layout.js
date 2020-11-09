import Head from 'next/head';

const Layout = ({ children }) => (
  <div className="flex items-center justify-center h-screen w-screen">
    <Head>
      <title>Next Fauna GraphQL CRUD</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="w-3/4 md:w-1/2">
      <div>
          {children}
          </div>
    </main>
  </div>
);

export default Layout;