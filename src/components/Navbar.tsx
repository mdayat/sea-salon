import { useEffect } from "react";
import { Container, useColorMode } from "@chakra-ui/react";

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return <Container></Container>;
}
