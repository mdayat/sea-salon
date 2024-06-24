import { memo, useState, type ChangeEvent, type FormEvent } from "react";
import { z as zod } from "zod";
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
  useToast,
} from "@chakra-ui/react";

import { Eye } from "../components/icons/Eye";
import { EyeSlash } from "../components/icons/EyeSlash";

interface Customer {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export const RegistrationForm = memo(function RegistrationForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [customer, setCustomer] = useState<Customer>({
    fullName: "asdasdsa",
    email: "dancok@gmail.com",
    phoneNumber: "0857481966",
    password: "Dancok_030603",
  });

  function handleFormOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isEmailValid = validateEmail(customer.email);
    if (isEmailValid === false) {
      setInvalidEmail(true);
      return;
    }

    setLoading(true);
    registerNewCustomer(customer)
      .then(({ status, message }) => {
        if (status === "success") {
          toast({
            title: "Account created.",
            description: message,
            status: "success",
            duration: null,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Create account failed.",
            description: message,
            status: "error",
            duration: null,
            isClosable: true,
            position: "top-right",
          });
        }
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
            placeholder="fullName"
          />
        </FormControl>

        <FormControl isInvalid={invalidEmail} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={customer.email}
            onChange={handleInputOnChange}
            type="email"
            name="email"
            placeholder="email"
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
            placeholder="phoneNumber"
            pattern="^(\+62|0)\d{8,13}$"
          />
          <FormHelperText>
            E.g., +6281234567890 or 081234567890, both are valid phone numbers.
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={customer.password}
              onChange={handleInputOnChange}
              type={passwordVisible ? "text" : "password"}
              minLength={12}
              name="password"
              placeholder="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d[^a-zA-Z\d]]{12,}$"
            />

            <InputRightElement width="4.5rem">
              <IconButton
                icon={
                  passwordVisible ? (
                    <Eye className="fill-zinc-50 w-4 h-4" />
                  ) : (
                    <EyeSlash className="fill-zinc-50 w-4 h-4" />
                  )
                }
                aria-label={passwordVisible ? "Show password" : "Hide password"}
                onClick={() => setPasswordVisible(!passwordVisible)}
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
    </Stack>
  );
});

function validateEmail(email: string): boolean {
  const emailSchema = zod.string().email();
  const result = emailSchema.safeParse(email);
  return result.success;
}

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
        if (res.status === 200) {
          resolve({
            status: "success",
            message: "We have created your account.",
          });
        } else {
          resolve({
            status: "failed",
            message: "Please check the data you entered again.",
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          // Retry the request properly when the request is 500, indicating server error
          console.error(error.response);

          resolve({
            status: "failed",
            message: "Something is wrong. Please try again.",
          });
        } else if (error.request) {
          resolve({
            status: "failed",
            message: "We couldn't process your request due to a timeout.",
          });

          // Log the error properly when the request is timeout
          console.error(error.request);
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      });
  });
  return promise;
}
