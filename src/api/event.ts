import EventSource from "eventsource";
import { SSEOptions } from "../types";

function startSSE(options: SSEOptions, eventSource: EventSource | undefined): void {
  if(eventSource?.url === options.url) {
    return;
  } else {
    eventSource = new EventSource(options.url, options.headers);
  }

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    options.onMessage(data);
  };

  eventSource.onerror = (error) => {
      options.onError(error);
  };
}

function stopSSE(eventSource: EventSource | undefined): void {
  if (eventSource) {
    eventSource.close();
    eventSource = undefined;
  } else {
    console.log("No active SSE connection");
  }
}

export { startSSE, stopSSE };