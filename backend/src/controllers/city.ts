import * as cityModel from "../models/city";
import { City } from "../types/city";

export async function getCities(): Promise<City[]> {
  const cities = await cityModel.getCities();
  if (!cities) {
    throw new Error("No cities found");
  }
  return cities;
}

export async function deleteCity(id: number): Promise<City | undefined> {
  const city = await cityModel.deleteCity(id);
  if (!city) {
    throw new Error("City not found");
  }
  return city;
}
