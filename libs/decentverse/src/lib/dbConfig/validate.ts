export const phoneNumber = (phone: string) => {
  return phone.split("-").length === 3;
};
export const emailAddress = (email: string) => {
  if (email.split("@").length !== 2) return false;
  else if (email.split(".").length === 1) return false;
  else return true;
};
