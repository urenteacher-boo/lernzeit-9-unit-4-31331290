import { createContext, useContext, useState, type ReactNode } from "react";

interface UserContextType {
  week1Name: string;
  setWeek1Name: (name: string) => void;
  week2Name: string;
  setWeek2Name: (name: string) => void;
  week3Name: string;
  setWeek3Name: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  week1Name: "",
  setWeek1Name: () => {},
  week2Name: "",
  setWeek2Name: () => {},
  week3Name: "",
  setWeek3Name: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [week1Name, setWeek1Name] = useState("");
  const [week2Name, setWeek2Name] = useState("");
  const [week3Name, setWeek3Name] = useState("");
  return (
    <UserContext.Provider value={{ week1Name, setWeek1Name, week2Name, setWeek2Name, week3Name, setWeek3Name }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
