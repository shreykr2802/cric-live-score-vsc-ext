import { EventSourceInitDict } from "eventsource";
import * as vscode from "vscode";

export interface Match {
  link: string;
  innerText: string;
  text: string;
}

export interface MatchItem extends vscode.TreeItem {
  innerText: string;
  label: string;
}

export type LiveMatch = Record<"title" | "value", string>[];

export interface SSEOptions {
  url: string;
  headers: EventSourceInitDict;
  onMessage: (data: any) => void;
  onError: (error: any) => void;
}