import axios from "axios";

export const getAllCities = async (): Promise<
  { name: string; id: string }[]
> => {
  const data = await axios.get("/api/v1/cities");
  return data.data;
};

export const deleteCity = async (id: string): Promise<void> => {
  await axios.delete(`/api/v1/cities/${id}`);
};
