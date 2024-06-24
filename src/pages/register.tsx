import { Fragment } from "react";
import dynamic from "next/dynamic";
import { useWindowSize } from "../hooks/useWindowSize";

const Grid = dynamic(() => import("@chakra-ui/react").then(({ Grid }) => Grid));
const GridItem = dynamic(() =>
  import("@chakra-ui/react").then(({ GridItem }) => GridItem)
);

const RegistrationForm = dynamic(() =>
  import("../components/RegistrationForm").then(
    ({ RegistrationForm }) => RegistrationForm
  )
);
const LoginAndRegistrationLeftPanel = dynamic(() =>
  import("../components/LoginAndRegistrationLeftPanel").then(
    ({ LoginAndRegistrationLeftPanel }) => LoginAndRegistrationLeftPanel
  )
);

export default function Register() {
  const { width } = useWindowSize();

  if (width === 0) {
    return <Fragment />;
  }

  if (width < 1024) {
    return (
      <div className="relative h-screen">
        <RegistrationForm />
      </div>
    );
  }

  return (
    <Grid templateColumns="repeat(2, 1fr)" className="h-screen">
      <GridItem bg="purple.600" className="relative">
        <LoginAndRegistrationLeftPanel />
      </GridItem>

      <GridItem className="relative">
        <RegistrationForm />
      </GridItem>
    </Grid>
  );
}
