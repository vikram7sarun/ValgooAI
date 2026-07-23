import type { MarketType } from "./algo";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  enabledAlgoCount: number;
}

export interface AdminAlgo {
  id: string;
  name: string;
  marketType: MarketType;
  description: string;
  activeUserCount: number;
}

export interface UserAlgoToggle {
  id: string;
  name: string;
  marketType: MarketType;
  description: string;
  enabled: boolean;
  enabledAt: string | null;
}
