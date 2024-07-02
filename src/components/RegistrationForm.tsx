import Link from "next/link";
import axios from "axios";
import { memo, useState, type ChangeEvent, type FormEvent } from "react";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { EyeOpenIcon } from "./icons/EyeOpenIcon";
import { EyeCloseIcon } from "./icons/EyeCloseIcon";
import { userSchema, type User } from "../types/user";

export const RegistrationForm = memo(function RegistrationForm() {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [user, setUser] = useState<Omit<User, "id" | "role">>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  function handleFormOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = userSchema.omit({ id: true, role: true }).safeParse(user);
    if (result.success === false) {
      setIsEmailInvalid(true);
      return;
    }

    setLoading(true);
    axios
      .post("/api/register", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        toast({
          title: "Registration Success",
          description: "We have created your account",
          status: "success",
          duration: null,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast({
              title: "Registration Failed",
              description: error.message,
              status: "error",
              duration: null,
              isClosable: true,
              position: "top-right",
            });
          } else {
            // Retry and log the error properly
            console.error("Error", error.message);
            toast({
              title: "Registration Failed",
              description: "Something is wrong, please try again",
              status: "error",
              duration: null,
              isClosable: true,
              position: "top-right",
            });
          }
        } else if (error.request) {
          // Retry and log the error properly
          console.error("Error", error.message);
          toast({
            title: "Registration Failed",
            description: "Registration failed due to timeout",
            status: "error",
            duration: null,
            isClosable: true,
            position: "top-right",
          });
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  return (
    <Stack
      rowGap="8"
      className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-sm"
    >
      <Heading fontSize="3xl" className="text-center">
        Be part of our family
      </Heading>

      <form
        onSubmit={handleFormOnSubmit}
        action=""
        autoComplete="off"
        className="flex flex-col gap-y-4"
      >
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            value={user.fullName}
            onChange={handleInputOnChange}
            type="text"
            name="fullName"
            placeholder="Enter your name"
          />
        </FormControl>

        <FormControl isInvalid={isEmailInvalid} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={user.email}
            onChange={handleInputOnChange}
            type="email"
            name="email"
            placeholder="Enter your email"
          />
          <FormErrorMessage>Invalid email</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            value={user.phoneNumber}
            onChange={handleInputOnChange}
            type="tel"
            name="phoneNumber"
            placeholder="Enter your phone number"
            pattern="^0\d{8,13}$"
          />
          <FormHelperText>
            E.g., 081234567890 is a valid phone number.
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={user.password}
              onChange={handleInputOnChange}
              type={isPasswordVisible ? "text" : "password"}
              minLength={12}
              name="password"
              placeholder="Enter your password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$"
            />

            <InputRightElement width="4.5rem">
              <IconButton
                icon={
                  isPasswordVisible ? (
                    <EyeOpenIcon className="fill-gray-50 w-4 h-4" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-50 w-4 h-4" />
                  )
                }
                aria-label={
                  isPasswordVisible ? "Show password" : "Hide password"
                }
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                colorScheme="gray"
                size="xs"
              />
            </InputRightElement>
          </InputGroup>
          <FormHelperText>
            Password must be at least 12 characters long and contain at least
            one uppercase letter, one lowercase letter, one number, and one
            special character.
          </FormHelperText>
        </FormControl>

        <Button
          isLoading={loading}
          loadingText="Submitting"
          type="submit"
          colorScheme="purple"
          className="mt-4"
        >
          Submit
        </Button>
      </form>

      <Text className="text-center">
        Already have an account?&nbsp;
        <Button as={Link} colorScheme="purple" variant="link" href="/login">
          Login
        </Button>
      </Text>
    </Stack>
  );
});
