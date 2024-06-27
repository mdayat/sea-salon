import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Text,
  Mark,
  SimpleGrid,
} from "@chakra-ui/react";

export function OurServices() {
  return (
    <section
      id="services"
      className="max-w-screen-xl mx-auto mt-2 px-8 pt-14 md:pt-[72px]"
    >
      <Heading as="h2" size="xl" className="text-center mb-4">
        Our Services
      </Heading>

      <Text fontSize="xl" className="max-w-screen-md text-center mx-auto mb-12">
        Enhance your beauty with our expert haircuts, nail care, and facial
        treatments.
      </Text>

      <SimpleGrid
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        spacing="8"
      >
        <Card className="mx-auto">
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1606333259737-6da197890fa2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Person holding white and gold hair comb"
              borderRadius="lg"
            />
            <div className="flex flex-col gap-y-4 mt-8">
              <Heading size="md">Haircuts and Styling</Heading>
              <Text>
                Transform your look with precision cuts and expert styling. Our
                stylists use the latest techniques and top products to ensure
                you leave looking and feeling your best.
              </Text>

              <Text color="gray.300" fontSize="sm">
                Session Duration:&nbsp;
                <Mark color="purple.300" className="font-bold p-1 rounded-full">
                  60 minutes
                </Mark>
              </Text>
            </div>
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              as={Link}
              colorScheme="purple"
              href="/dashboard"
              className="w-full"
            >
              Make a reservation
            </Button>
          </CardFooter>
        </Card>

        <Card className="mx-auto">
          <CardBody>
            <Image
              src="https://plus.unsplash.com/premium_photo-1661580623387-5b1abd14484f?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Side view portrait of adult bearded man chiropodist examining feet and toes while patient sitting on the medical chair in beauty clinic"
              borderRadius="lg"
            />
            <div className="flex flex-col gap-y-4 mt-8">
              <Heading size="md">Manicure and Pedicure</Heading>
              <Text>
                Pamper yourself with our meticulous manicure and pedicure
                services. Enjoy perfectly groomed nails and soft, revitalized
                skin in a relaxing atmosphere.
              </Text>

              <Text color="gray.300" fontSize="sm">
                Session Duration:&nbsp;
                <Mark color="purple.300" className="font-bold p-1 rounded-full">
                  60 minutes
                </Mark>
              </Text>
            </div>
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              as={Link}
              colorScheme="purple"
              href="/dashboard"
              className="w-full"
            >
              Make a reservation
            </Button>
          </CardFooter>
        </Card>

        <Card className="mx-auto">
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Woman lying on blue towel with white cream on face"
              borderRadius="lg"
            />
            <div className="flex flex-col gap-y-4 mt-8">
              <Heading size="md">Facial Treatments</Heading>
              <Text>
                Refresh and rejuvenate your skin with our tailored facial
                treatments. Our skilled estheticians use high-quality products
                to deliver radiant, youthful results.
              </Text>

              <Text color="gray.300" fontSize="sm">
                Session Duration:&nbsp;
                <Mark color="purple.300" className="font-bold p-1 rounded-full">
                  60 minutes
                </Mark>
              </Text>
            </div>
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              as={Link}
              colorScheme="purple"
              href="/dashboard"
              className="w-full"
            >
              Make a reservation
            </Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </section>
  );
}
