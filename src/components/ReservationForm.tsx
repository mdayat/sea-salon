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
} from "@chakra-ui/react";

import { getUser } from "../utils/user";
import type { User } from "../types/user";

interface Reservation {
  name: string;
  phoneNumber: string;
  serviceType: string;
  date: string;
  time: string;
}

interface ReservationFormProps {
  user: Pick<User, "fullName" | "phoneNumber">;
  setUser: Dispatch<SetStateAction<Pick<User, "fullName" | "phoneNumber">>>;
}

export function ReservationForm({ user, setUser }: ReservationFormProps) {
  const router = useRouter();
  const btnRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const minDate = getMinDate();
  const maxDate = getMaxDate();

  const [reservation, setReservation] = useState<Reservation>({
    name: "",
    phoneNumber: "",
    serviceType: "",
    date: "",
    time: "",
  });

  function handleInputOnChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setReservation({
      ...reservation,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  const handleFormOnSubmit = useCallback(
    (event: FormEvent<HTMLFormElement | HTMLDivElement>) => {
      event.preventDefault();
      console.log(reservation);
    },
    [reservation]
  );

  function handleModalOnOpen() {
    if (user.fullName === "" && user.phoneNumber === "") {
      getUser()
        .then((user) => {
          setUser(user);
          setReservation({
            ...reservation,
            name: user.fullName,
            phoneNumber: user.phoneNumber,
          });
        })
        .catch(() => {
          router.reload();
        });
    } else {
      setReservation({
        ...reservation,
        name: user.fullName,
        phoneNumber: user.phoneNumber,
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
                defaultValue={reservation.name}
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
                defaultValue={reservation.phoneNumber}
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

              <Button type="submit" colorScheme="purple">
                Submit
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function getMinDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dateOfMonth = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${dateOfMonth}`;
}

function getMaxDate(): string {
  const date = new Date(new Date().getFullYear(), 11, 31);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dateOfMonth = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${dateOfMonth}`;
}