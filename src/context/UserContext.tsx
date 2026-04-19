import { createContext, useContext, useState, type ReactNode } from "react";

interface UserContextType {
  studentName: string;
  setStudentName: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  studentName: "",
  setStudentName: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [studentName, setStudentName] = useState("");
  return (
    <UserContext.Provider value={{ studentName, setStudentName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
