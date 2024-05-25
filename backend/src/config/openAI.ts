import { OpenAI } from "openai";

const ACCESS_TOKEN = process.env.OPENAI_API_KEY;

if (!ACCESS_TOKEN) {
  throw new Error(
    "OpenAI API key not provided. set it in .env file as OPENAI_API_KEY=YOUR_API_KEY"
  );
}

export const openai = new OpenAI({
  apiKey: ACCESS_TOKEN,
});
