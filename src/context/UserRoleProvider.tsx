import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import { getCookieValue } from "../utils/cookie";
import type { UserRole } from "../types/user";

export const UserRoleContext = createContext<UserRole | null>(null);

export function UserRoleProvider({ children }: PropsWithChildren) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const userRole = getCookieValue("user_role");
    setUserRole(userRole === "" ? null : (userRole as UserRole));
  }, []);

  return (
    <UserRoleContext.Provider value={userRole}>
      {children}
    </UserRoleContext.Provider>
  );
}
