import Link from "next/link";
import { useContext, useRef } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { UserRoleContext } from "../../context/UserRoleProvider";
import { CloseIcon } from "../icons/CloseIcon";
import { MenuIcon } from "../icons/MenuIcon";

interface MobileDrawerProps {
  buttonText: string;
  buttonLink: string;
  handleOnLogout: () => void;
}

export function MobileDrawer({
  buttonText,
  buttonLink,
  handleOnLogout,
}: MobileDrawerProps) {
  const userRole = useContext(UserRoleContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
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
                href="/#services"
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
                href="/#contact-us"
                justifyContent="start"
                className="w-full"
              >
                Contact Us
              </Button>
            </li>
          </DrawerBody>

          <DrawerFooter className="flex justify-between items-center gap-x-4">
            <Button
              as={Link}
              onClick={onClose}
              variant="outline"
              href={buttonLink}
              className="w-full"
            >
              {buttonText}
            </Button>

            {userRole === null ? (
              <Button
                as={Link}
                onClick={onClose}
                variant="outline"
                href="/register"
                className="w-full"
              >
                Register
              </Button>
            ) : (
              <Button
                onClick={handleOnLogout}
                variant="outline"
                colorScheme="red"
                className="w-full"
              >
                Logout
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
