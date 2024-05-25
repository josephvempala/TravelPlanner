import { openai } from "../config/openAI";
import { Attraction } from "../types/attraction";
import * as attractionsModel from "../models/attraction";

async function generateAttractionByCity(
  city: string
): Promise<Attraction[] | null> {
  const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: false,
    messages: [
      {
        role: "system",
        content: `You are a travel agent helping a customer plan a trip to ${city}. The customer wants to know about the top attractions in ${city}.
  return the top attractions in ${city}. The data should include the name, description, category, image URL, and rating of each attraction.
  if ${city} is not a valid city or if there are no attractions available for ${city},
  then return an empty array.
  return the data in the following JSON format:
  {
      "attractions": [
          {
          "name": "Eiffel Tower",
          "description": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
          "category": "Landmark",
          "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Eiffel_Tower_Paris_France.jpg/220px-Eiffel_Tower_Paris_France.jpg",
          "rating": 4.8
          },
          {
          "name": "Louvre Museum",
          "description": "The Louvre, or the Louvre Museum, is the world's largest art museum and a historic monument in Paris, France. A central landmark of the city, it is located on the Right Bank of the Seine in the city's 1st arrondissement.",
          "category": "Museum",
          "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Louvre_Pyramid.jpg/220px-Louvre_Pyramid.jpg",
          "rating": 4.7
          },
          {
          "name": "Notre-Dame Cathedral",
          "description": "Notre-Dame de Paris, referred to simply as Notre-Dame, is a medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris. The cathedral was consecrated to the Virgin Mary and considered to be one of the finest examples of French Gothic architecture.",
          "category": "Cathedral",
          "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Notre-Dame_de_Paris%2C_exterior.jpg/220px-Notre-Dame_de_Paris%2C_exterior.jpg",
          "rating": 4.6
          }
      ]
  }
  return only JSON data.
          `,
      },
    ],
    response_format: { type: "json_object" },
  });
  const data = result.choices[0].message.content;
  if (!data) return null;
  return JSON.parse(data).attractions as Attraction[];
}

export async function getNewAttractions(
  city: string
): Promise<{ attractions: Attraction[]; cityId: string }> {
  const attractions = await generateAttractionByCity(city);
  if (!attractions || attractions.length === 0) {
    throw new Error("Failed to generate attractions");
  }
  const cityId = await attractionsModel.create(city, attractions);
  return { attractions, cityId };
}

export async function getAttractionsByCity(
  cityId: number
): Promise<Attraction[] | null> {
  const attractions = await attractionsModel.getAttractionsByCity(cityId);
  if (!attractions) {
    throw new Error("No attractions found for the city");
  }
  return attractions;
}

export async function deleteAttraction(id: number): Promise<void> {
  const attraction = await attractionsModel.remove(id);
}
