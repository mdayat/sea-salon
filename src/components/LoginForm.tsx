import Link from "next/link";
import { memo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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

export const LoginForm = memo(function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [user, setUser] = useState<Pick<User, "email" | "password">>({
    email: "",
    password: "",
  });

  function handleFormOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = userSchema
      .pick({ email: true, password: true })
      .safeParse(user);

    if (result.success === false) {
      setIsEmailInvalid(true);
      return;
    }

    setLoading(true);
    axios
      .post("/api/login", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        toast({
          title: "Login Success",
          description: "You will be redirected to dashboard",
          status: "success",
          duration: null,
          isClosable: true,
          position: "top-right",
        });

        setTimeout(() => {
          toast.closeAll();
          router.reload();
        }, 1500);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast({
              title: "Login Failed",
              description: error.response.data.message,
              status: "error",
              duration: null,
              isClosable: true,
              position: "top-right",
            });
          } else {
            // Retry and log the error properly
            console.error("Error", error.message);
            toast({
              title: "Login Failed",
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
            title: "Login Failed",
            description: "Login failed due to timeout",
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
        if (isEmailInvalid) {
          setIsEmailInvalid(false);
        }
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
        Log in to your account
      </Heading>

      <form
        onSubmit={handleFormOnSubmit}
        action=""
        className="flex flex-col gap-y-4"
      >
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
          className="mt-2"
        >
          Submit
        </Button>
      </form>

      <Text className="text-center">
        Don&apos;t have an account?&nbsp;
        <Button as={Link} colorScheme="purple" variant="link" href="/register">
          Create Account
        </Button>
      </Text>
    </Stack>
  );
});
