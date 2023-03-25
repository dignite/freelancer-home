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
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

export default function FreelancerHome({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ApplicationContainer>
          <Component {...pageProps} />
          <Heading>Navigation</Heading>
          <UnorderedList>
            <UnorderedListItem>
              <Link href="/">Home</Link>
            </UnorderedListItem>
            <UnorderedListItem>
              <Link href="/day">Day</Link>
            </UnorderedListItem>
            <UnorderedListItem>
              <Link href="/month">Month</Link>
            </UnorderedListItem>
          </UnorderedList>
        </ApplicationContainer>
      </Hydrate>
    </QueryClientProvider>
  );
}
