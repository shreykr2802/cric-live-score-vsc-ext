// import EventSource from "eventsource";
// interface CustomEvent extends Event {
//     cancelBubble: boolean;
//   }
// export async function fetchLiveEvents(matchUrl: string) {
//     const eventSource = new EventSource(`http://localhost:3000/live-updates?matchUrl=${matchUrl}`, {
//         headers: { SECRET: process.env.SECRET },
//       });
//     let matchData;
//     eventSource.onmessage = (event) => {
//          matchData = JSON.parse(event.data);
//     };
//     console.log("matchData",matchData)
//     eventSource.onerror = (err) => {
//         console.error("EventSource failed:", err);
//         eventSource.close();
//     };

//     return {eventSource,matchData}
// }
