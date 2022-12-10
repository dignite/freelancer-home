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
          <Link href="/">Home</Link>
        </UnorderedListItem>
        <UnorderedListItem>
          <Link href="/about">About</Link>
        </UnorderedListItem>
      </UnorderedList>
    </ApplicationContainer>
  );
}
