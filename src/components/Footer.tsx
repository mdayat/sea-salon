import Link from "next/link";
import { Divider, Text } from "@chakra-ui/react";
import { GithubIcon } from "./icons/GithubIcon";

export function Footer() {
  const fullYear = new Date().getFullYear();

  return (
    <footer className="max-w-screen-xl px-8 mx-auto mt-16 md:mt-20">
      <Divider />
      <div className="flex justify-between items-center gap-x-8 my-8 px-1">
        <Text color="gray.300" className="font-medium">
          &copy; {fullYear} SEA Salon. All rights reserved.
        </Text>

        <Link href="https://github.com/mdayat" rel="noopener" target="_blank">
          <GithubIcon className="fill-gray-50 w-8 h-8" />
        </Link>
      </div>
    </footer>
  );
}
