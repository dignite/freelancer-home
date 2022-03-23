import "normalize.css";
import { ApplicationContainer } from "../components/vertical-rhythm";
import "../vertical-rhythm.css";

export default function FreelancerHome({ Component, pageProps }) {
  return (
    <ApplicationContainer>
      <Component {...pageProps} />
    </ApplicationContainer>
  );
}
