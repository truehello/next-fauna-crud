import Head from 'next/head';
import Header from '../components/header';

const Layout = ({ children }) => (
  <div>
    <Head>
      <title>Next Fauna GraphQL CRUD</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex flex-col min-h-screen w-screen">
    <Header />
    <main className="flex flex-grow items-center justify-center pt-10 pb-40 " style={{backgroundColor: 'rgba(74,29,150,1)'}}>
      <div className="w-3/4 md:w-1/2">
          {children}
      </div>
    </main>
    <footer className=" text-gray-100 relative bottom-0 flex justify-between items-center mx-auto px-2 sm:px-6 lg:px-8 h-16 w-full" 
    style={{backgroundColor: 'rgba(74,29,150,1)'}}>
   
      <p> © {new Date().getFullYear()}, Built with Nextjs and FaunaDB</p>
      <p>@truehello</p>
     
    </footer>
    </div>
  </div>
);

export default Layout;