import type { Metadata } from "next";

// Shared by every root layout. "text-scale" lets mobile browsers apply the
// text size chosen in the operating system (all type is set in rem).
export const documentMeta: NonNullable<Metadata["other"]> = {
  "text-scale": "scale",
};
