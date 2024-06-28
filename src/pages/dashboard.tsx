import { useContext } from "react";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UserRoleContext } from "../context/UserRoleProvider";
import type { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  const userRole = useContext(UserRoleContext);
  return <h1>This is dashboard page {userRole}</h1>;
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
