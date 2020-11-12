import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Layout from "../components/layout";
import { getAuthCookie } from "../utils/auth-cookies";

const Profile = ({ token }) => {
  const router = useRouter();

  const { data: user } = useSWR("/api/user");

  const [errorMessage, setErrorMessage] = useState("");

  if (!user) router.push("/login");

  return (
    <Layout>
      <h1>Hello from profile</h1>
      {user ? (
        <p>{user.email}</p>
      ) : (
        <div className="flex">you need to be logged in</div>
      )}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const token = getAuthCookie(ctx.req);
  return { props: { token: token || null } };
}

export default Profile;
