import seed from "./doctor-directory-data.json";

export type DirectoryDoctor = (typeof seed.doctors)[number];
export type DirectoryFacility = (typeof seed.facilities)[number];
export type DirectoryAffiliation = (typeof seed.affiliations)[number];
export const directory = seed;

export function doctorAffiliations(doctorId: string) {
  return directory.affiliations
    .filter((item) => item.doctorId === doctorId)
    .map((item) => ({
      ...item,
      facility: directory.facilities.find(
        (facility) => facility.id === item.facilityId,
      )!,
    }));
}
export function facilityDoctors(facilityId: string) {
  return directory.affiliations
    .filter((item) => item.facilityId === facilityId)
    .map((item) => ({
      ...item,
      doctor: directory.doctors.find((doctor) => doctor.id === item.doctorId)!,
    }));
}
export function displayFee(affiliation: DirectoryAffiliation) {
  if (!affiliation.feePkr) return { text: "To confirm", unverified: false };
  return {
    text: `PKR ${affiliation.feePkr.toLocaleString("en-PK")}`,
    unverified: affiliation.feeStatus === "unverified",
  };
}
