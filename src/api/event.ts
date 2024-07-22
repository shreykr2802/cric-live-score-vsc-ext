import EventSource from "eventsource";
import { SSEOptions } from "../types";

let currentEventSource: EventSource | undefined;

function startSSE(options: SSEOptions): void {
  if (currentEventSource) {
    stopSSE();
  }

  currentEventSource = new EventSource(options.url, options.headers);

  currentEventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    options.onMessage(data);
  };

  currentEventSource.onerror = (error) => {
    options.onError(error);
  };
}

function stopSSE(): void {
  if (currentEventSource) {
    currentEventSource.close();
    currentEventSource = undefined;
  } else {
    console.log("No active SSE connection");
  }
}

export { startSSE, stopSSE };
