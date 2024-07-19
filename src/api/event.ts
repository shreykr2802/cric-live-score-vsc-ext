import EventSource from "eventsource";
import { LiveMatch } from "../types";

export async function getLiveUpdatesScore(
  matchUrl: string | undefined
): Promise<LiveMatch | undefined> {
  console.log("matchUrl", matchUrl);
  if (matchUrl) {
    const eventSource = new EventSource(
      `http://localhost:3000/livematch/liveUpdates?matchUrl=${matchUrl}`,
      {
        headers: { SECRET: "01J2XW401CJMBBWXC975RAEB15" },
      }
    );

    eventSource.onmessage = (event) => {
      console.log("event on message", JSON.parse(event.data));
      return JSON.parse(event.data);
    };

    eventSource.onopen = (event) => {
      console.log("event open", event);
    };

    eventSource.onerror = (event) => {
      console.log("data error", event);
      return Error("Error While fetching Data");
    };
  }
  return undefined;
}

// async function getData() {
//   const data = await getLiveUpdatesScore(
//     "https://www.espncricinfo.com/series/west-indies-in-england-2024-1385669/england-vs-west-indies-2nd-test-1385692/live-cricket-score"
//   );
//   console.log("event -- data --", data);
// }

// getData().then();
