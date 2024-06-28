import Image from "next/image";
import Link from "next/link";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

import { ArrowRightIcon } from "../components/icons/ArrowRightIcon";

export function Hero() {
  return (
    <div className="relative h-[calc(100vh-56px)] md:h-[calc(100vh-72px)]">
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-full max-w-screen-sm flex flex-col gap-y-4 px-8 md:px-0">
        <Heading
          fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
          as="h1"
          lineHeight="normal"
          className="text-left md:text-center"
        >
          Beauty and Elegance Redefined
        </Heading>

        <Text
          fontSize={{ base: "md", sm: "lg", lg: "xl" }}
          className="md:text-center"
        >
          Experience unparalleled beauty and elegance with expert stylists.
          Discover the artistry of refined beauty today.
        </Text>

        <div className="flex flex-col gap-y-4 mt-4 md:flex-row md:gap-y-0 md:gap-x-4 md:justify-center md:items-center">
          <Button as={Link} href="/dashboard" colorScheme="purple">
            Make a reservation
          </Button>

          <Button
            as={Link}
            href="#services"
            variant="outline"
            className="gap-x-2"
          >
            Learn more <ArrowRightIcon className="fill-gray-50 w-4 h-4" />
          </Button>
        </div>
      </div>

      <Box
        backgroundColor="gray.900"
        className="absolute top-0 left-0 right-0 bottom-0 opacity-25"
      >
        <Image
          src="https://images.unsplash.com/photo-1493775379751-a6c3940f3cbc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Grayscale photography of woman getting her hair done inside salon"
          className="object-cover object-center w-full -z-10"
          fill
        />
      </Box>
    </div>
  );
}
