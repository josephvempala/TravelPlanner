import { connect } from "../config/db";
import { City } from "../types/city";

export async function getCities(): Promise<City[] | undefined> {
  const db = await connect();
  const cities = await db.all("SELECT * FROM city");
  db.close();
  return cities as City[] | undefined;
}

export async function deleteCity(id: number): Promise<City | undefined> {
  const db = await connect();
  // get city and verify it exists then delete
  const city = await db.get("SELECT * FROM city WHERE id = ?", [id]);
  if (!city) {
    throw new Error("City not found");
  }
  await db.run("DELETE FROM city WHERE id = ?", [id]);
  db.close();
  return city as City;
}

export async function getCityById(id: number): Promise<City | undefined> {
  const db = await connect();
  const city = await db.get("SELECT * FROM city WHERE id = ?", [id]);
  db.close();
  return city as City | undefined;
}
