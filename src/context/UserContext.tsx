import { createContext, useContext, useState, type ReactNode } from "react";

interface UserContextType {
  week1Name: string;
  setWeek1Name: (name: string) => void;
  week2Name: string;
  setWeek2Name: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  week1Name: "",
  setWeek1Name: () => {},
  week2Name: "",
  setWeek2Name: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [week1Name, setWeek1Name] = useState("");
  const [week2Name, setWeek2Name] = useState("");
  return (
    <UserContext.Provider value={{ week1Name, setWeek1Name, week2Name, setWeek2Name }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
