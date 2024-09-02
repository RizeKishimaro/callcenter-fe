import axiosInstance from "../../providers/axiosClient";

const CAMPAIGN_URL = "campaign";

export const getAllCampaigns = async () => {
  const response = await axiosInstance.get(CAMPAIGN_URL);
  return response.data;
};

export const createCampaign = async (body: {
  name: string;
  concurrentlimit: number;
  strategy: string;
  prefix: string;
}) => {
  const response = await axiosInstance.post(CAMPAIGN_URL, body);
  return response.data;
};

export const updateCampaign = async (
  id: number,
  body: { name: string; concurrentlimit: number; strategy: string }
) => {
  const response = await axiosInstance.put(`${CAMPAIGN_URL}/${id}`, body);
  return response.data;
};

export const getCampaign = async (id: number) => {
  const response = await axiosInstance.get(`${CAMPAIGN_URL}/${id}`);
  return response.data;
};

export const deleteCampaign = async (id: number) => {
  const response = await axiosInstance.delete(`${CAMPAIGN_URL}/${id}`);
  return response.data;
};
