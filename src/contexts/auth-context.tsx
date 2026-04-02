"use client";

import React, { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "@/lib/mock-data";
import type { User } from "@/types";

interface AuthCtx { user: User | null; signIn: (email: string, pw: string) => Promise<boolean>; signUp: (name: string, email: string, pw: string) => Promise<boolean>; signOut: () => void; }
const Ctx = createContext<AuthCtx>({ user: null, signIn: async () => false, signUp: async () => false, signOut: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USERS[1]);
  const signIn = async (email: string) => { await new Promise(r => setTimeout(r, 800)); setUser(MOCK_USERS.find(u => u.email === email) ?? MOCK_USERS[1]); return true; };
  const signUp = async () => { await new Promise(r => setTimeout(r, 1000)); setUser(MOCK_USERS[2]); return true; };
  const signOut = () => setUser(null);
  return <Ctx.Provider value={{ user, signIn, signUp, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
