import { Hono } from "hono";
import * as city from "../controllers/city";

const app = new Hono();

app
  .get("/", async (c) => {
    try {
      const response = await city.getCities();
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
      await city.deleteCity(id);
      return c.json({ message: "City deleted" });
    } catch (e: any) {
      c.status(500);
      return c.json(e);
    }
  });

export default app;
