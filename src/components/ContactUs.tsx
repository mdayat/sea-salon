import Link from "next/link";
import { Box, Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";

import { LocationIcon } from "./icons/LocationIcon";
import { PhoneIcon } from "./icons/PhoneIcon";
import { EmailIcon } from "./icons/EmailIcon";

export function ContactUs() {
  return (
    <div className="mt-2 pt-14 mb-16 md:pt-[72px] md:mb-20">
      <Box backgroundColor="gray.700" className="px-8">
        <section id="contact-us" className="max-w-screen-xl mx-auto py-16">
          <Heading
            fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
            as="h2"
            className="text-center mb-4"
          >
            Contact Us
          </Heading>

          <Text
            fontSize={{ base: "md", sm: "lg", lg: "xl" }}
            className="max-w-screen-md text-center mx-auto mb-12"
          >
            We&apos;re here to help and answer any questions you might have. We
            look forward to hearing from you!
          </Text>

          <SimpleGrid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            spacing="8"
          >
            <div className="flex flex-col items-center">
              <LocationIcon className="fill-gray-50 w-10 h-10 md:w-12 md:h-12" />
              <Heading
                fontSize={{ base: "xl", sm: "2xl" }}
                as="h3"
                className="mt-2 mb-4"
              >
                Phone
              </Heading>

              <Text className="max-w-[256px] text-center">
                Jl. Oyakatasama RT 01 RW 01, Kelurahan Tsukoyomi
              </Text>
            </div>

            <div className="flex flex-col items-center">
              <PhoneIcon className="fill-gray-50 w-10 h-10 md:w-12 md:h-12" />
              <Heading
                fontSize={{ base: "xl", sm: "2xl" }}
                as="h3"
                className="mt-2 mb-4"
              >
                Phone
              </Heading>

              <div className="flex flex-col">
                <Text
                  color="gray.300"
                  className="flex justify-between items-center gap-x-2"
                >
                  Thomas:
                  <Button
                    as={Link}
                    href="https://wa.me/08123456789"
                    colorScheme="purple"
                    variant="link"
                    rel="noopener"
                    target="_blank"
                  >
                    08123456789
                  </Button>
                </Text>

                <Text
                  color="gray.300"
                  className="flex justify-between items-center gap-x-2"
                >
                  Sekar:
                  <Button
                    as={Link}
                    href="https://wa.me/08164829372"
                    colorScheme="purple"
                    variant="link"
                    rel="noopener"
                    target="_blank"
                  >
                    08164829372
                  </Button>
                </Text>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <EmailIcon className="fill-gray-50 w-10 h-10 md:w-12 md:h-12" />
              <Heading
                fontSize={{ base: "xl", sm: "2xl" }}
                as="h3"
                className="mt-2 mb-4"
              >
                Email
              </Heading>

              <Button
                as={Link}
                href="mailto:seasalon@gmail.com"
                colorScheme="purple"
                variant="link"
              >
                seasalon@gmail.com
              </Button>
            </div>
          </SimpleGrid>
        </section>
      </Box>
    </div>
  );
}
