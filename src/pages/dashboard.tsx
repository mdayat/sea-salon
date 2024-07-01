import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Heading,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

import { ReservationForm } from "../components/ReservationForm";
import { Navbar } from "../components/Navbar";
import type { NextPageWithLayout } from "./_app";
import type { Reservation } from "../types/reservation";
import type { User } from "../types/user";
import type { SuccessResponse } from "../types/api";
import { ReviewForm } from "../components/ReviewForm";

const Dashboard: NextPageWithLayout = () => {
  const [reservations, setReservations] = useState<Omit<Reservation, "id">[]>(
    []
  );

  const [user, setUser] = useState<Pick<User, "fullName" | "phoneNumber">>({
    fullName: "",
    phoneNumber: "",
  });

  const toast = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get<SuccessResponse<Omit<Reservation, "id">[]>>("/api/reservations", {
        timeout: 3000,
      })
      .then((res) => {
        setReservations(res.data.data);
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
  }, [toast, router]);

  return (
    <div className="max-w-screen-xl px-8 mx-auto mt-16 md:mt-20">
      <div className="flex justify-between items-center mb-8">
        <Heading as="h1" size="lg">
          Reservations
        </Heading>

        <div className="flex justify-between items-center gap-x-6">
          <ReviewForm user={user} setUser={setUser} />
          <ReservationForm user={user} setUser={setUser} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Your reservations at SEA Salon</TableCaption>
            <Thead backgroundColor="gray.700">
              <Tr>
                <Th>Name</Th>
                <Th>Service</Th>
                <Th>Date and Time</Th>
              </Tr>
            </Thead>

            <Tbody>
              {reservations.map(({ customerName, serviceType, date, time }) => {
                return (
                  <Tr key={`${date}-${time}`}>
                    <Td>{customerName}</Td>
                    <Td>{serviceType.split("_").join(" ")}</Td>
                    <Td>
                      {new Date(date).toDateString()}, at{" "}
                      {time.split(":").splice(0, 2).join(":")} WIB
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

Dashboard.getLayout = (page) => {
  return (
    <>
      <Navbar />
      <main className="font-poppins">{page}</main>
    </>
  );
};

export default Dashboard;
