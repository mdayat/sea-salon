import { useRouter } from "next/router";
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { getUser } from "../utils/user";
import { createReservation, getMinAndMaxDate } from "../utils/reservation";
import { type Reservation, reservationSchema } from "../types/reservation";
import type { User } from "../types/user";

interface ReservationFormProps {
  user: Pick<User, "fullName" | "phoneNumber">;
  setUser: Dispatch<SetStateAction<Pick<User, "fullName" | "phoneNumber">>>;
}

export function ReservationForm({ user, setUser }: ReservationFormProps) {
  const toast = useToast();
  const router = useRouter();

  const btnRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { minDate, maxDate } = getMinAndMaxDate();

  const [reservation, setReservation] = useState<
    Pick<Reservation, "serviceType" | "date" | "time">
  >({
    serviceType: "haircuts_and_styling",
    date: "",
    time: "",
  });

  function handleInputOnChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const inputValue =
      event.currentTarget.name === "time"
        ? event.currentTarget.value + ":00"
        : event.currentTarget.value;

    setReservation({
      ...reservation,
      [event.currentTarget.name]: inputValue,
    });
  }

  const handleFormOnSubmit = useCallback(
    (event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
      event.preventDefault();
      const result = reservationSchema
        .omit({ id: true })
        .safeParse(reservation);

      if (result.success === false) {
        // Log the error properly
        console.error(result.error);
      }

      setIsLoading(true);
      createReservation({
        serviceType: reservation.serviceType,
        date: reservation.date,
        time: reservation.time,
      })
        .then(() => {
          toast({
            title: "Create Reservation Success",
            description: "We have created your reservation",
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
          toast({
            title: "Create Reservation Failed",
            description: error.message,
            status: "error",
            duration: null,
            isClosable: true,
            position: "top-right",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [reservation, toast, router, onClose]
  );

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
      <div className="flex justify-between items-center mb-8">
        <Heading as="h1" size="lg">
          Reservations
        </Heading>

        <Button onClick={handleModalOnOpen} colorScheme="purple">
          Make a reservation
        </Button>
      </div>

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

            <FormControl isReadOnly>
              <FormLabel className="select-none">Phone Number</FormLabel>
              <Input
                defaultValue={user.phoneNumber}
                variant="filled"
                type="text"
                name="phoneNumber"
                disabled
              />
              <FormHelperText>
                We automatically fill this part based on your registered&nbsp;
                <strong>phone number</strong>.
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Service Type</FormLabel>
              <Select
                onChange={handleInputOnChange}
                name="serviceType"
                placeholder="Select Service"
                className="cursor-pointer"
              >
                <option value="haircuts_and_styling">
                  Haircuts and Styling
                </option>
                <option value="manicure_and_pedicure">
                  Manicure and Pedicure
                </option>
                <option value="facial_treatments">Facial Treatments</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Session Date</FormLabel>
              <Input
                onChange={handleInputOnChange}
                min={minDate}
                max={maxDate}
                type="date"
                name="date"
                placeholder="Select Date"
                className="cursor-pointer"
              />
              <FormHelperText>
                You can make a reservation that&apos;s valid until this
                year&apos;s last month.
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Session Time</FormLabel>
              <Input
                onChange={handleInputOnChange}
                type="time"
                name="time"
                min="09:00"
                max="21:00"
                placeholder="Select Time"
                className="cursor-pointer"
              />
              <FormHelperText>
                We are open daily from 09.00 WIB to 21.00 WIB.
              </FormHelperText>
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
