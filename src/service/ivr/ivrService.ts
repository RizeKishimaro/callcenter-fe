import axiosInstance from "../../providers/axiosClient";
import { BulkIvrType, IvrType } from "../../providers/types/ivrType";

const IVR_URL = "ivr";

export const getIvrs = async () => {
  const response = await axiosInstance.get(IVR_URL);
  return response.data;
};

export const createIvr = async ({
  body,
}: {
  body: IvrType;
  campaignId: number;
}) => {
  const response = await axiosInstance.post(`${IVR_URL}/`, body);
  return response.data;
};

export const bulkCreateIvr = async ({
  ivrs,
  campaignId,
}: {
  ivrs: BulkIvrType; // Ensure this type matches BulkIvrType
  campaignId: number;
}) => {
  const response = await axiosInstance.post(
    `${IVR_URL}/bulk-create/${campaignId}`,
    {
      ivrs
    }
  );
  return response.data;
};

export const uploadIvrZipFile = async (formData: FormData) => {
  const response = await axiosInstance.post(`${IVR_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the request is recognized as multipart
    },
  });
  return response.data;
};

export const findIvrByFilename = async (data: { filename: string }) => {
  const response = await axiosInstance.post(`${IVR_URL}/${data.filename}`);
  return response.data;
};

export const updateIvr = async (id: number, body: IvrType) => {
  const response = await axiosInstance.put(`${IVR_URL}/${id}`, body);
  return response.data;
};

export const getIvr = async (id: number) => {
  const response = await axiosInstance.get(`${IVR_URL}/${id}`);
  return response.data;
};

export const deleteIvr = async (id: number) => {
  const response = await axiosInstance.delete(`${IVR_URL}/${id}`);
  return response.data;
};
