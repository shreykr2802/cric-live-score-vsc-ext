import axios from "axios";
import { Match } from "../types";

export async function fetchLiveMatches(): Promise<Match[]> {
  const response = await axios.get("http://localhost:3000/live", {
    headers: { SECRET: process.env.SECRET },
  });
  return response.data;
}
