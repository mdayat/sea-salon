import dynamic from "next/dynamic";
import { Fragment, type ReactElement } from "react";

import { useWindowSize } from "../hooks/useWindowSize";
import type { NextPageWithLayout } from "./_app";

const Grid = dynamic(() => import("@chakra-ui/react").then(({ Grid }) => Grid));
const GridItem = dynamic(() =>
  import("@chakra-ui/react").then(({ GridItem }) => GridItem)
);

const LoginForm = dynamic(() =>
  import("../components/LoginForm").then(({ LoginForm }) => LoginForm)
);
const LoginAndRegistrationLeftPanel = dynamic(() =>
  import("../components/LoginAndRegistrationLeftPanel").then(
    ({ LoginAndRegistrationLeftPanel }) => LoginAndRegistrationLeftPanel
  )
);

const Login: NextPageWithLayout = () => {
  const { width } = useWindowSize();

  if (width === 0) {
    return <Fragment />;
  }

  if (width < 1024) {
    return (
      <div className="relative h-screen">
        <LoginForm />
      </div>
    );
  }

  return (
    <Grid templateColumns="repeat(2, 1fr)" className="h-screen">
      <GridItem bg="purple.600" className="relative">
        <LoginAndRegistrationLeftPanel />
      </GridItem>

      <GridItem className="relative">
        <LoginForm />
      </GridItem>
    </Grid>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <main className="font-poppins">{page}</main>;
};

export default Login;
