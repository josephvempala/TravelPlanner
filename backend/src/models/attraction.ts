import { connect } from "../config/db";

import { Attraction } from "../types/attraction";

export async function getAttractionById(
  id: number
): Promise<Attraction | undefined> {
  const db = await connect();
  const attraction = await db.get("SELECT * FROM attractions WHERE id = ?", [
    id,
  ]);
  db.close();
  return attraction as Attraction | undefined;
}

export async function getAttractionsByCity(
  city_id: number
): Promise<Attraction[] | undefined> {
  const db = await connect();
  const attractions = await db.all(
    "SELECT * FROM attractions WHERE city_id = ?",
    [city_id]
  );
  db.close();
  return attractions as Attraction[] | undefined;
}

export async function create(city: string, attractions: Attraction[]) {
  const db = await connect();
  // create a new city if it doesn't exist and add the attraction
  let city_id = await db.get("SELECT id FROM city WHERE name = ?", [city]);

  if (!city_id) {
    await db.run("INSERT INTO city (name) VALUES (?)", [city]);
    const { id } = await db.get("SELECT id FROM city WHERE name = ?", [city]);
    city_id = id;
  }
  // add attractions parallelly
  const promises = attractions.map((attraction) =>
    db.run(
      "INSERT INTO attractions (name, description, category, image_url, rating, city_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        attraction.name,
        attraction.description,
        attraction.category,
        attraction.image_url,
        attraction.rating,
        city_id,
      ]
    )
  );
  const results = await Promise.all(promises);
  db.close();

  return city_id;
}

export async function update(
  id: number,
  attraction: Attraction
): Promise<number | undefined> {
  const db = await connect();
  const result = await db.run(
    "UPDATE attractions SET name = ?, description = ?, category = ?, image_url = ?, rating = ? WHERE id = ?",
    [
      attraction.name,
      attraction.description,
      attraction.category,
      attraction.image_url,
      attraction.rating,
      id,
    ]
  );
  db.close();
  return result.lastID;
}

export async function remove(id: number): Promise<number | undefined> {
  const db = await connect();
  const result = await db.run("DELETE FROM attractions WHERE id = ?", [id]);
  db.close();
  return result.lastID;
}
