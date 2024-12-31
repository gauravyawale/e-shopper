import crypto from "crypto";
export const getRandom6DigitOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};
