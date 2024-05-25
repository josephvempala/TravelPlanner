import axios from "axios";
import { Attraction } from "../../../../backend/src/types/attraction";

export const getAllCities = async (): Promise<
  { name: string; id: string }[]
> => {
  const data = await axios.get("/api/v1/attractions/cities");
  return data.data;
};

export const getAttractionsByCity = async (
  cityId: number
): Promise<Attraction[]> => {
  const data = await axios.get(`/api/v1/attractions/${cityId}`);
  return data.data;
};

export const generateAttractions = async (
  city: string
): Promise<{ attractions: Attraction[]; cityId: string }> => {
  const data = await axios.get(`/api/v1/attractions/generate?city=${city}`);
  return data.data;
};

export const deleteAttraction = async (id: number): Promise<void> => {
  await axios.delete(`/api/v1/attractions/${id}`);
};
