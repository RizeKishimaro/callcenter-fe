import CryptoJS from "crypto-js";

const SECRECT_KEY = import.meta.env.VITE_APP_SECRECT_KEY;

export const useEncrypt = (text: string) => {
  const encrypt = (): string => {
    const encrypted = CryptoJS.AES.encrypt(text, SECRECT_KEY).toString();
    return encrypted;
  };
  return encrypt();
};
