import { site } from "@/content/site";

export const { email } = site.legal;

// LSSI owner identification, with each label in the page language.
export function ownerLines(labels: {
  owner: string;
  taxId: string;
  address: string;
  email: string;
  pending: string;
}): string[] {
  const { owner, taxId, address } = site.legal;
  return [
    `${labels.owner}: ${owner}`,
    `${labels.taxId}: ${taxId || labels.pending}`,
    `${labels.address}: ${address || labels.pending}`,
    `${labels.email}: ${email}`,
  ];
}
