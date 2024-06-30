import { useState } from "react";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { ReservationForm } from "../components/ReservationForm";
import { Navbar } from "../components/Navbar";
import type { NextPageWithLayout } from "./_app";
import type { User } from "../types/user";

const Dashboard: NextPageWithLayout = () => {
  const [user, setUser] = useState<Pick<User, "fullName" | "phoneNumber">>({
    fullName: "",
    phoneNumber: "",
  });

  return (
    <div className="max-w-screen-xl px-8 mx-auto mt-16 md:mt-20">
      <ReservationForm user={user} setUser={setUser} />

      <TableContainer>
        <Table variant="simple">
          <TableCaption>Your reservations at SEA Salon</TableCaption>
          <Thead backgroundColor="gray.700">
            <Tr>
              <Th>Name</Th>
              <Th>Service</Th>
              <Th>Date and Time</Th>
              <Th>Duration</Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td>Muhammad Nur Hidayat</Td>
              <Td>Haircut and Styling</Td>
              <Td>24 June, 2024</Td>
              <Td>120 Minutes</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
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
