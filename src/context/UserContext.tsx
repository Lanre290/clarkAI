import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    country: string;
    role: string;
    is_premium: boolean;
    streak_count: number;
}

interface UserContextProps {
    user: User | null;
    setUser: (user: User | null) => void;
}


const UserContext = createContext<UserContextProps | undefined>(undefined);



interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};



export const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
