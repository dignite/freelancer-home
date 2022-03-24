import "normalize.css";
import "../vertical-rhythm.css";
import "../colors.css";

import {
  ApplicationContainer,
  Heading,
  UnorderedList,
  UnorderedListItem,
} from "../components/vertical-rhythm";
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
          <Link href="/about">
            <a>About</a>
          </Link>
        </UnorderedListItem>
      </UnorderedList>
    </ApplicationContainer>
  );
}
