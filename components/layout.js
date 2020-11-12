import Head from 'next/head';
import Header from '../components/header';

const Layout = ({ children }) => (
  <div>
    <Head>
      <title>Next Fauna GraphQL CRUD</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex flex-col h-screen w-screen">
    <Header />
    <main className="flex items-center justify-center">
      <div className="w-3/4 md:w-1/2">
          {children}
      </div>
    </main>
    <footer className="absolute bottom-0 flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 w-full">
   
      <p> © {new Date().getFullYear()}, Built with Nextjs and FaunaDB</p>
      <p>@truehello</p>
     
    </footer>
    </div>
  </div>
);

export default Layout;