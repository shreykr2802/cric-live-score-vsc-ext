import axios from "axios";
import { LiveMatch, Match } from "../types";

export async function fetchLiveMatches(): Promise<Match[]> {
  const response = await axios.get("https://cric-api-gamma.vercel.app/live", {
    headers: { SECRET: process.env.SECRET },
  });
  return response.data;
}

export async function fetchLiveMatchDetailsFromUrl(matchUrl: string): Promise<LiveMatch> {
  const response = await axios.get(
    `https://cric-api-gamma.vercel.app/livematch?matchUrl=${matchUrl}`,
    {
      headers: { SECRET: process.env.SECRET },
    }
  );
  return response.data;
}
