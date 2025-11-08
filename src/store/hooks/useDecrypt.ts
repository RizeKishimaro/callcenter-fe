import  CryptoJS from "crypto-js";
const SECRECT_KEY = import.meta.env.VITE_APP_SECRECT_KEY;

export const useDecrypt = (encryptedText: string): string => {
  const decrypt = (): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRECT_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  };
  return decrypt();
};
