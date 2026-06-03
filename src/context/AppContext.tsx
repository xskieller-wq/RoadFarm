"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Reservation } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: "buyer" | "seller") => boolean;
  logout: () => void;
  isSeller: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    const isAdmin = email.includes("admin");
    const isSeller = !isAdmin && email.includes("seller");
    setUser({
      id: "u1",
      email,
      name: isAdmin ? "RouteFarm Admin" : isSeller ? "Green Valley Farm" : "Demo Buyer",
      role: isAdmin ? "admin" : isSeller ? "seller" : "buyer",
      sellerId: isSeller ? "s1" : undefined,
    });
    return true;
  }, []);

  const signup = useCallback(
    (name: string, email: string, _password: string, role: "buyer" | "seller") => {
      setUser({
        id: "u-new",
        email,
        name,
        role,
        sellerId: role === "seller" ? "s-new" : undefined,
      });
      return true;
    },
    []
  );

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isSeller: user?.role === "seller",
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, "id" | "reservedAt" | "status">) => void;
}

const ReservationContext = createContext<ReservationContextType | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addReservation = useCallback(
    (reservation: Omit<Reservation, "id" | "reservedAt" | "status">) => {
      setReservations((prev) => [
        ...prev,
        {
          ...reservation,
          id: `r${Date.now()}`,
          reservedAt: new Date().toISOString(),
          status: "confirmed",
        },
      ]);
    },
    []
  );

  return (
    <ReservationContext.Provider value={{ reservations, addReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservations must be used within ReservationProvider");
  return ctx;
}
