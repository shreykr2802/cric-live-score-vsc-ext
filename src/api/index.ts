import axios from "axios";
import { LiveMatch, Match } from "../types";

export async function fetchLiveMatches(): Promise<Match[]> {
  const response = await axios.get("http://localhost:3000/live", {
    headers: { SECRET: process.env.SECRET },
  });
  return response.data;
}

export async function fetchLiveMatchDetailsFromUrl(matchUrl: string): Promise<LiveMatch> {
  const response = await axios.get(
    `http://localhost:3000/livematch?matchUrl=${matchUrl}`,
    {
      headers: { SECRET: process.env.SECRET },
    }
  );
  return response.data;
}
