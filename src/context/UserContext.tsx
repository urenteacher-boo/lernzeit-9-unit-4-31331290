import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface UserContextType {
  week1Name: string;
  setWeek1Name: (name: string) => void;
  week2Name: string;
  setWeek2Name: (name: string) => void;
  week3Name: string;
  setWeek3Name: (name: string) => void;
  week4Name: string;
  setWeek4Name: (name: string) => void;
  week5Name: string;
  setWeek5Name: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  week1Name: "",
  setWeek1Name: () => {},
  week2Name: "",
  setWeek2Name: () => {},
  week3Name: "",
  setWeek3Name: () => {},
  week4Name: "",
  setWeek4Name: () => {},
  week5Name: "",
  setWeek5Name: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [week1Name, setWeek1Name] = useLocalStorage("lz-week1-name", "");
  const [week2Name, setWeek2Name] = useLocalStorage("lz-week2-name", "");
  const [week3Name, setWeek3Name] = useLocalStorage("lz-week3-name", "");
  const [week4Name, setWeek4Name] = useLocalStorage("lz-week4-name", "");
  const [week5Name, setWeek5Name] = useLocalStorage("lz-week5-name", "");
  return (
    <UserContext.Provider value={{ week1Name, setWeek1Name, week2Name, setWeek2Name, week3Name, setWeek3Name, week4Name, setWeek4Name, week5Name, setWeek5Name }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
