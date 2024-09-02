import axiosInstance from "../../providers/axiosClient";
import { SipProviderType } from "../../providers/types/sipProviderType";

const SIP_PROVIDER_URL = "sip-provider";

export const getAllSipProviders = async () => {
  const response = await axiosInstance.get(SIP_PROVIDER_URL);
  return response.data;
};

export const createSipProvider = async (body: {
  provider_number: string;
  name: string;
  codecs: string;
  transport: string;
  host: string;
  extension: string;
}) => {
  const response = await axiosInstance.post(SIP_PROVIDER_URL, body);
  return response.data;
};

export const updateSipProvider = async (id: number, body: {
  provider_number: string;
  name: string;
  codecs: string;
  transport: string;
  host: string;
  extension: string;
}) => {
  const response = await axiosInstance.put(`${SIP_PROVIDER_URL}/${id}`, body);
  return response.data;
};

export const getSipProvider = async (id: number) => {
  const response = await axiosInstance.get(`${SIP_PROVIDER_URL}/${id}`);
  return response.data;
};

export const deleteSipProvider = async (id: number) => {
  const response = await axiosInstance.delete(`${SIP_PROVIDER_URL}/${id}`);
  return response.data;
};
