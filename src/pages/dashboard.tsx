import { useContext } from "react";

import { UserRoleContext } from "../context/UserRoleProvider";

export default function Dashboard() {
  const { userRole } = useContext(UserRoleContext);
  return <h1>This is dashboard page {userRole}</h1>;
}
