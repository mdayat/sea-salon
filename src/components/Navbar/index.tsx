import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useMemo } from "react";
import { Box, Button, useColorMode } from "@chakra-ui/react";

import { UserRoleContext } from "../../context/UserRoleProvider";
import { logout } from "../../utils/user";
import { useWindowSize } from "../../hooks/useWindowSize";

const MobileDrawer = dynamic(() =>
  import("./MobileDrawer").then(({ MobileDrawer }) => MobileDrawer)
);

export function Navbar() {
  const router = useRouter();
  const userRole = useContext(UserRoleContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const { width } = useWindowSize();

  const { buttonText, buttonLink } = useMemo((): {
    buttonText: string;
    buttonLink: string;
  } => {
    if (userRole === null) {
      return { buttonText: "Login", buttonLink: "/login" };
    }

    if (router.pathname === "/") {
      return { buttonText: "Dashboard", buttonLink: "/dashboard" };
    }

    return { buttonText: "Home", buttonLink: "/" };
  }, [userRole, router.pathname]);

  function handleOnLogout() {
    logout().then(() => {
      router.reload();
    });
  }

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  if (width === 0) {
    <Fragment />;
  }

  return (
    <Box
      backgroundColor="gray.800"
      className="font-poppins sticky top-0 z-20 py-4 px-8"
    >
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center gap-x-12">
          <Button as={Link} variant="link" href="/">
            SEA SALON
          </Button>

          {width >= 768 ? (
            <ul className="flex justify-between items-center gap-x-8">
              <li>
                <Button
                  as={Link}
                  _hover={{
                    color: "gray.300",
                  }}
                  variant="link"
                  href="/#services"
                >
                  Services
                </Button>
              </li>

              <li>
                <Button
                  as={Link}
                  _hover={{
                    color: "gray.300",
                  }}
                  variant="link"
                  href="/#contact-us"
                >
                  Contact Us
                </Button>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>

        {width >= 768 ? (
          <div className="flex justify-between items-center gap-x-4">
            <Button as={Link} variant="outline" href={buttonLink}>
              {buttonText}
            </Button>

            {userRole === null ? (
              <Button as={Link} variant="outline" href="/register">
                Register
              </Button>
            ) : (
              <Button
                variant="outline"
                colorScheme="red"
                onClick={handleOnLogout}
              >
                Logout
              </Button>
            )}
          </div>
        ) : (
          <MobileDrawer
            buttonText={buttonText}
            buttonLink={buttonLink}
            handleOnLogout={handleOnLogout}
          />
        )}
      </div>
    </Box>
  );
}
