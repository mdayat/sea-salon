import Link from "next/link";
import dynamic from "next/dynamic";
import { Fragment, useContext, useEffect, useRef } from "react";
import { Box, Button, useColorMode, useDisclosure } from "@chakra-ui/react";

import { UserRoleContext } from "../context/UserRoleProvider";
import { MenuIcon } from "./icons/MenuIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { useWindowSize } from "../hooks/useWindowSize";

const Drawer = dynamic(() =>
  import("@chakra-ui/react").then(({ Drawer }) => Drawer)
);
const DrawerBody = dynamic(() =>
  import("@chakra-ui/react").then(({ DrawerBody }) => DrawerBody)
);
const DrawerContent = dynamic(() =>
  import("@chakra-ui/react").then(({ DrawerContent }) => DrawerContent)
);
const DrawerHeader = dynamic(() =>
  import("@chakra-ui/react").then(({ DrawerHeader }) => DrawerHeader)
);
const DrawerOverlay = dynamic(() =>
  import("@chakra-ui/react").then(({ DrawerOverlay }) => DrawerOverlay)
);
const DrawerFooter = dynamic(() =>
  import("@chakra-ui/react").then(({ DrawerFooter }) => DrawerFooter)
);

export function Navbar() {
  const { userRole } = useContext(UserRoleContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const btnRef = useRef<HTMLButtonElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  if (width === 0) {
    <Fragment />;
  }

  return (
    <Box backgroundColor="gray.800" className="sticky top-0 z-20 py-4 px-8">
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
                  href="#services"
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
                  href="#contact-us"
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
          userRole === null ? (
            <div className="flex justify-between items-center gap-x-6">
              <Button as={Link} variant="outline" href="/login">
                Sign In
              </Button>

              <Button as={Link} variant="outline" href="/register">
                Sign Up
              </Button>
            </div>
          ) : (
            <Button as={Link} variant="outline" href="/dashboard">
              Dashboard
            </Button>
          )
        ) : (
          <>
            <button ref={btnRef} type="button" onClick={onOpen}>
              {isOpen ? (
                <CloseIcon className="fill-gray-50 w-6 h-6" />
              ) : (
                <MenuIcon className="fill-gray-50 w-6 h-6" />
              )}
            </button>

            <Drawer
              isOpen={isOpen}
              onClose={onClose}
              finalFocusRef={btnRef}
              placement="left"
            >
              <DrawerOverlay />
              <DrawerContent backgroundColor="gray.800">
                <DrawerHeader as={Link} onClick={onClose} href="/">
                  SEA SALON
                </DrawerHeader>

                <DrawerBody as="ul" className="flex flex-col gap-y-1">
                  <li>
                    <Button
                      as={Link}
                      onClick={onClose}
                      variant="ghost"
                      href="#services"
                      justifyContent="start"
                      className="w-full"
                    >
                      Services
                    </Button>
                  </li>

                  <li>
                    <Button
                      as={Link}
                      onClick={onClose}
                      variant="ghost"
                      href="#contact-us"
                      justifyContent="start"
                      className="w-full"
                    >
                      Contact Us
                    </Button>
                  </li>
                </DrawerBody>

                <DrawerFooter className="flex justify-between items-center gap-x-4">
                  {userRole === null ? (
                    <>
                      <Button
                        as={Link}
                        onClick={onClose}
                        variant="outline"
                        href="/login"
                        className="w-full"
                      >
                        Sign In
                      </Button>

                      <Button
                        as={Link}
                        onClick={onClose}
                        variant="outline"
                        href="/register"
                        className="w-full"
                      >
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <Button
                      as={Link}
                      onClick={onClose}
                      variant="outline"
                      href="/dashboard"
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                  )}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    </Box>
  );
}
