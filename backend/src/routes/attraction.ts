import { Hono } from "hono";
import * as attraction from "../controllers/attraction";
import * as city from "../controllers/city";

const app = new Hono();

app
  .get("/generate", async (c) => {
    try {
      const city = c.req.query("city");
      if (!city) {
        c.status(400);
        return c.json({ message: "City is required" });
      }
      const response = await attraction.getNewAttractions(city);
      if (!response) {
        c.status(404);
        return c.json({ message: "No attractions found for " + city });
      }
      return c.json(response);
    } catch (e: any) {
      c.status(500);
      return c.json(e);
    }
  })
  .get("/:cityId", async (c) => {
    try {
      const cityId = parseInt(c.req.param("cityId"));
      if (Number.isNaN(cityId)) {
        c.status(400);
        return c.json({ message: "City ID is a number" });
      }
      const response = await attraction.getAttractionsByCity(cityId);
      if (!response) {
        c.status(404);
        return c.json({ message: "No attractions found for the city" });
      }
      return c.json(response);
    } catch (e: any) {
      c.status(500);
      return c.json(e);
    }
  })
  .delete("/:id", async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      if (Number.isNaN(id)) {
        c.status(400);
        return c.json({ message: "ID is a number" });
      }
      await attraction.deleteAttraction(id);
      return c.json({ message: "Attraction deleted" });
    } catch (e: any) {
      c.status(500);
      return c.json(e);
    }
  });

export default app;
