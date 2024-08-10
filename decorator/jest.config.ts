import type { Config } from "jest";

export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
} satisfies Config;
