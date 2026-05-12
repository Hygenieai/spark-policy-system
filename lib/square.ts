/*
  Square Web Payments SDK integration stub.
  Design philosophy: Editorial Institutional Modernism.

  This file is intentionally environment-aware so it can migrate into the Spark website
  as lib/square.ts or lib/policy-system/square.ts with no structural changes.

  In production, set:
    NEXT_PUBLIC_SQUARE_APP_ID   — your Square application ID
    NEXT_PUBLIC_SQUARE_LOCATION_ID — your Square location ID
    NEXT_PUBLIC_SQUARE_ENV      — "sandbox" | "production"

  For the MVP preview, sandbox credentials are used so the card widget renders fully.
*/

export const SQUARE_APP_ID =
  (process.env.NEXT_PUBLIC_SQUARE_APP_ID as string | undefined) ??
  "sandbox-sq0idb-XXXXXXXXXXXXXXXXXXXXXXXX";

export const SQUARE_LOCATION_ID =
  (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string | undefined) ??
  "LXXXXXXXXXXXXXXXXX";

export const SQUARE_ENV: "sandbox" | "production" =
  (process.env.NEXT_PUBLIC_SQUARE_ENV as "sandbox" | "production" | undefined) ??
  "sandbox";

export const SQUARE_SDK_URL =
  SQUARE_ENV === "production"
    ? "https://web.squarecdn.com/v1/square.js"
    : "https://sandbox.web.squarecdn.com/v1/square.js";

/** Package pricing — single source of truth shared with the checkout UI. */
export const PACKAGE = {
  name: "Spark Policy System — Edition I, Dermatology",
  description: "184-policy manual · 7 sections · single-practice PDF license",
  priceLabel: "$497",
  priceCents: 49700,
  currency: "USD",
} as const;

/** Minimal type shim for the Square Web Payments SDK global. */
export type SquarePaymentsInstance = {
  card: (options?: object) => Promise<SquareCard>;
};

export type SquareCard = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<SquareTokenizeResult>;
  destroy: () => Promise<void>;
};

export type SquareTokenizeResult = {
  status: "OK" | "Cancel" | string;
  token?: string;
  errors?: Array<{ message: string }>;
};

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePaymentsInstance>;
    };
  }
}
