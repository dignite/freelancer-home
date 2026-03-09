import { getCurrentMonthRedirect } from "./[month]";

export default function IndexPage() {
  return null;
}

export async function getServerSideProps() {
  return getCurrentMonthRedirect();
}
