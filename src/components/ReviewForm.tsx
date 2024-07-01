import { useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { getUser } from "../utils/user";
import type { User } from "../types/user";
import { type Review, reviewSchema } from "../types/review";

interface ReservationFormProps {
  user: Pick<User, "fullName" | "phoneNumber">;
  setUser: Dispatch<SetStateAction<Pick<User, "fullName" | "phoneNumber">>>;
}

export function ReviewForm({ user, setUser }: ReservationFormProps) {
  const [review, setReview] = useState<Review>({ rating: 1, description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const btnRef = useRef(null);
  const router = useRouter();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleFormOnSubmit(
    event: FormEvent<HTMLFormElement | HTMLDivElement>
  ) {
    event.preventDefault();
    const result = reviewSchema.safeParse(review);
    if (result.success === false) {
      // Log the error properly
      console.error(result.error);
    }

    setIsLoading(true);
    axios
      .post("/api/reviews", review, {
        headers: { "Content-Type": "application/json" },
        timeout: 3000,
      })
      .then(() => {
        toast({
          title: "Create Review Success",
          description: "Thank you for your review",
          status: "success",
          duration: null,
          isClosable: true,
          position: "top-right",
        });

        setTimeout(() => {
          toast.closeAll();
          onClose();
          router.reload();
        }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            toast({
              title: "Session Expired",
              description: "Your session has expired, please login again",
              status: "error",
              duration: null,
              isClosable: true,
              position: "top-right",
            });

            setTimeout(() => {
              toast.closeAll();
              router.reload();
            }, 1500);
          } else {
            // Retry and log the error properly
            console.error("Error", error.message);
          }
        } else if (error.request) {
          // Retry and log the error properly
          console.error("Error", error.message);
        } else {
          // Log the error properly
          console.error("Error", error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleModalOnOpen() {
    if (user.fullName === "" && user.phoneNumber === "") {
      getUser()
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          router.reload();
        });
    }
    onOpen();
  }

  return (
    <>
      <Button
        onClick={handleModalOnOpen}
        variant="outline"
        colorScheme="purple"
      >
        Create review
      </Button>

      <Modal
        closeOnOverlayClick={false}
        finalFocusRef={btnRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent marginX="6">
          <ModalBody
            onSubmit={handleFormOnSubmit}
            as="form"
            paddingY="4"
            className="flex flex-col gap-y-4"
          >
            <FormControl isReadOnly>
              <FormLabel className="select-none">Name</FormLabel>
              <Input
                defaultValue={user.fullName}
                variant="filled"
                type="text"
                name="name"
                disabled
              />
              <FormHelperText>
                We automatically fill this part based on your registered{" "}
                <strong>full name</strong>.
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Rating</FormLabel>
              <NumberInput
                onChange={(value) =>
                  setReview({ ...review, rating: Number(value) })
                }
                value={review.rating}
                min={1}
                max={5}
                name="rating"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                Please input a number between 1 to 5.
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                onChange={(event) =>
                  setReview({
                    ...review,
                    description: event.currentTarget.value,
                  })
                }
                value={review.description}
                name="description"
                placeholder="Your message"
              />
            </FormControl>

            <div className="flex justify-end items-center gap-x-4 mt-4">
              <Button variant="outline" colorScheme="red" onClick={onClose}>
                Cancle
              </Button>

              <Button
                isLoading={isLoading}
                loadingText="Submitting"
                type="submit"
                colorScheme="purple"
              >
                Submit
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
