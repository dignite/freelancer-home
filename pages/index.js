import Link from "next/link";
import { useState } from "react";
import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";

export default function IndexPage({ data }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      navbar={
        <Navbar
          p="md"
          // Breakpoint at which navbar will be hidden if hidden prop is true
          hiddenBreakpoint="sm"
          // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          hidden={!opened}
          // when viewport size is less than theme.breakpoints.sm navbar width is 100%
          // viewport size > theme.breakpoints.sm – width is 300px
          // viewport size > theme.breakpoints.lg – width is 400px
          width={{ sm: 300 }}
        >
          <Navbar.Section>
            <Link href="/">
              <a>Home</a>
            </Link>
          </Navbar.Section>
          <Navbar.Section>
            <Link href="/about">
              <a>About</a>
            </Link>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          {/* Handle other responsive styles with MediaQuery component or createStyles function */}
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>Freelancer Home</Text>
          </div>
        </Header>
      }
    >
      <h2>Unbilled invoice</h2>
      <p>{data.meta.unbilledInvoice.excludingVAT} excluding VAT</p>
      <h2>Total unbilled hours per week</h2>
      <ul>
        {Object.keys(data.meta.totalUnbilledHoursPerWeek).map((week) => (
          <li key={week}>
            {week}: {data.meta.totalUnbilledHoursPerWeek[week]}
          </li>
        ))}
        <li>Total: {data.meta.totalUnbilledHours}</li>
      </ul>
    </AppShell>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  const data = await res.json();
  return { props: { data } };
}
