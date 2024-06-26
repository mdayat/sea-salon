import Link from "next/link";
import { memo, useState, type ChangeEvent, type FormEvent } from "react";
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
import { customerSchema, type Customer } from "../types/customer";
import type { SentinelError } from "../types/sentinelError";

export const RegistrationForm = memo(function RegistrationForm() {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [customer, setCustomer] = useState<Customer>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  function handleFormOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = customerSchema.safeParse(customer);
    if (result.success === false) {
      setIsEmailInvalid(true);
      return;
    }

    setLoading(true);
    registerNewCustomer(customer)
      .then(({ status, message }) => {
        if (status !== "success") {
          toast({
            title: "Registration Failed",
            description: message,
            status: "error",
            duration: null,
            isClosable: true,
            position: "top-right",
          });
          return;
        }

        toast({
          title: "Registration Success",
          description: message,
          status: "success",
          duration: null,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleInputOnChange(event: ChangeEvent<HTMLInputElement>) {
    setCustomer({
      ...customer,
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
            value={customer.fullName}
            onChange={handleInputOnChange}
            type="text"
            name="fullName"
            placeholder="Enter your name"
          />
        </FormControl>

        <FormControl isInvalid={isEmailInvalid} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={customer.email}
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
            value={customer.phoneNumber}
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
              value={customer.password}
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

interface RegistrationStatus {
  status: "success" | "failed";
  message: string;
}

function registerNewCustomer(customer: Customer): Promise<RegistrationStatus> {
  const promise = new Promise<RegistrationStatus>((resolve) => {
    axios
      .post("/api/register", customer, {
        headers: { "Content-Type": "application/json" },
        timeout: 3000, // ms
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          const sentinelError: SentinelError = res.data.error.sentinel;
          switch (sentinelError) {
            case "RegisteredEmail": {
              resolve({
                status: "failed",
                message: "Email is already registered.",
              });
              break;
            }

            case "RegisteredPhoneNumber": {
              resolve({
                status: "failed",
                message: "Phone number is already registered.",
              });
              break;
            }

            default: {
              resolve({
                status: "failed",
                message: "Please check the data you entered again.",
              });
              break;
            }
          }
          return;
        }

        resolve({
          status: "success",
          message: "We have created your account.",
        });
      })
      .catch((error) => {
        if (error.response) {
          // Retry the request properly when the request is 500, indicating server error
          resolve({
            status: "failed",
            message: "Something is wrong. Please try again.",
          });
        } else if (error.request) {
          resolve({
            status: "failed",
            message: "We couldn't process your request due to a timeout.",
          });
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      });
  });
  return promise;
}
