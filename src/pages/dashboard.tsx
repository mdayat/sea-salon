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

import { CreateReservationForm } from "../components/CreateReservationForm";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import type { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div className="max-w-screen-xl px-8 mx-auto mt-16 md:mt-20">
      <CreateReservationForm />

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
      <Footer />
    </>
  );
};

export default Dashboard;
