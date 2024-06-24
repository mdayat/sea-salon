import { memo } from "react";
import { Avatar, AvatarGroup, Heading, Stack, Text } from "@chakra-ui/react";

export const LoginAndRegistrationLeftPanel = memo(
  function LoginAndRegistrationLeftPanel() {
    return (
      <Stack className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[calc(100%-64px)] max-w-lg">
        <Stack rowGap="4" className="mb-6">
          <Heading as="h1" size="2xl" lineHeight="normal">
            Begin your journey with our professional stylists.
          </Heading>
          <Text fontSize="large">
            Make a reservation and enjoy our premium services from our
            professional stylists.
          </Text>
        </Stack>

        <Stack columnGap="4" direction="row" className="items-center">
          <AvatarGroup>
            <Avatar name="Tanjiro Kamado" src="https://bit.ly/broken-link" />
            <Avatar name="King Inosuke" src="https://bit.ly/broken-link" />
            <Avatar name="Nezuko Chan" src="https://bit.ly/broken-link" />
            <Avatar
              name="Yoriichi Tsugikuni"
              src="https://bit.ly/broken-link"
            />
          </AvatarGroup>
          <Text fontSize="medium">With more than 15 stylists</Text>
        </Stack>
      </Stack>
    );
  }
);
