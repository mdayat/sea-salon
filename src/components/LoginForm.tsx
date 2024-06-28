import Link from "next/link";
import { memo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/router";

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
import { login } from "../utils/auth";
import { customerSchema, type Customer } from "../types/customer";

export const LoginForm = memo(function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [customer, setCustomer] = useState<
    Omit<Customer, "fullName" | "phoneNumber">
  >({
    email: "",
    password: "",
  });

  function handleFormOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = customerSchema
      .omit({ fullName: true, phoneNumber: true })
      .safeParse(customer);

    if (result.success === false) {
      setIsEmailInvalid(true);
      return;
    }

    setLoading(true);
    login(customer)
      .then((res) => {
        if (res.status === "failed") {
          toast({
            title: "Login Failed",
            description: res.message,
            status: "error",
            duration: null,
            isClosable: true,
            position: "top-right",
          });
          return;
        }

        toast({
          title: "Login Success",
          description: res.message,
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
      .finally(() => {
        setLoading(false);
        if (isEmailInvalid) {
          setIsEmailInvalid(false);
        }
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
            value={customer.email}
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
