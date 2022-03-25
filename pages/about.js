import {
  Heading,
  MainHeading,
  Paragraph,
  SubHeading,
  SubSubHeading,
} from "../modules/layout/vertical-rhythm";

export default function AboutPage() {
  return (
    <>
      <MainHeading>About Freelancer Home 🕚</MainHeading>
      <Heading>Goals</Heading>
      <SubHeading>1. Visualize Money and Time (IN PROGRESS)</SubHeading>
      <SubSubHeading>1.1. Money (TODO)</SubSubHeading>
      <Paragraph>
        In order to understand money going in and out of my company, I want to
        visualize money flow and different "threshold" such as money covering
        salary.
      </Paragraph>
      <SubSubHeading>1.2. Time (IN PROGRESS)</SubSubHeading>
      <Paragraph>
        In order to time report correctly, I want time to be shown in a format
        matching what I am expected to input.
      </Paragraph>
      <SubHeading>2. Control Harvest and Slack in Sync (TODO)</SubHeading>
      <Paragraph>
        I want to be able to clock into Harvest via this portal, and automate
        status updates (and notification settings) in Slack based on that.
      </Paragraph>
    </>
  );
}
