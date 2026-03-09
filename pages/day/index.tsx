import { getCurrentDayRedirect } from "./[day]";

export default function IndexPage() {
  return null;
}

export async function getServerSideProps() {
  return getCurrentDayRedirect();
}
