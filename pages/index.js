import Link from "next/link";

export default function IndexPage() {
  return (
    <div>
      Freelancer Home.{" "}
      <Link href="/about">
        <a>About</a>
      </Link>
    </div>
  );
}
