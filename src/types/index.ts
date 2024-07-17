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
