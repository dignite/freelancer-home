import "normalize.css";
import "../vertical-rhythm.css";
import "../colors.css";

import {
  ApplicationContainer,
  Heading,
  UnorderedList,
  UnorderedListItem,
} from "../modules/layout/vertical-rhythm";
import Link from "next/link";

export default function FreelancerHome({ Component, pageProps }) {
  return (
    <ApplicationContainer>
      <Component {...pageProps} />
      <Heading>Navigation</Heading>
      <UnorderedList>
        <UnorderedListItem>
          <Link href="/">
            <a>Home</a>
          </Link>
        </UnorderedListItem>
        <UnorderedListItem>
          <Link href="/day">
            <a>Day</a>
          </Link>
        </UnorderedListItem>
        <UnorderedListItem>
          <Link href="/month">
            <a>Month</a>
          </Link>
        </UnorderedListItem>
      </UnorderedList>
    </ApplicationContainer>
  );
}
