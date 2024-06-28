import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import { getCookieValue } from "../utils/cookie";

type UserRole = "customer" | "admin";
interface UserRoleProviderValue {
  userRole: UserRole | null;
  // eslint-disable-next-line no-unused-vars
  updateUserRole: (role: UserRole | null) => void;
}
export const UserRoleContext = createContext<UserRoleProviderValue>({
  userRole: null,
  updateUserRole: () => {},
});

export function UserRoleProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole | null>(null);

  // I don't need to memoize this thing
  // because i need this component to re-render when "role" is updated
  function updateUserRole(role: UserRole | null) {
    setRole(role);
  }

  useEffect(() => {
    const role = getCookieValue("user_role");
    setRole(role === "" ? null : (role as UserRole));
  }, []);

  return (
    <UserRoleContext.Provider value={{ userRole: role, updateUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}
