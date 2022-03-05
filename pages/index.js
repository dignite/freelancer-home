import Link from "next/link";
import { Profile } from "../modules/auth/profile";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function IndexPage() {
  return (
    <div>
      Freelancer Home. <Profile />{" "}
      <Link href="/about">
        <a>About</a>
      </Link>{" "}
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
