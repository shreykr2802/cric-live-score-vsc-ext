import axios from "axios";
import * as vscode from "vscode";

interface Match {
  link: string;
  innerText: string;
  text: string;
}

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log("Cricket Scores extension is now active!");

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);

  const disposable = vscode.commands.registerCommand(
    "cricketScores.showLiveScores",
    async () => {
      try {
        const liveMatches = await fetchLiveMatches();
        displayMatches(
          liveMatches.map((match) => ({
            innerText: match.innerText
              .replaceAll("&&", " ")
              .replaceAll("null", ""),
            link: match.link,
            text: match.innerText,
          }))
        );
      } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage("Failed to fetch live cricket scores.");
      }
    }
  );

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand("cricketScores.showLiveScores");
}

async function fetchLiveMatches(): Promise<Match[]> {
  const response = await axios.get("http://localhost:3000/live", {
    headers: { SECRET: process.env.SECRET },
  });
  return response.data;
}

function displayMatches(matches: Match[]) {
  const panel = vscode.window.createWebviewPanel(
    "cricketScores",
    "Live Cricket Scores",
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = getWebviewContent(matches);
  updateStatusBar(matches[2]);
}

function updateStatusBar(match: Match) {
  if (match && match.innerText.includes("LIVE")) {
    const matchData = match.text.split("&&");
    if (matchData.length !== 6) {
      statusBarItem.text = `$(pulse) ${matchData[2].trim()} vs ${matchData[3].trim()}`;
    } else {
      statusBarItem.text = `$(pulse) ${matchData[2].trim()} vs ${matchData[4].trim()} - ${matchData[3].trim()}`;
    }
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

function getWebviewContent(matches: Match[]): string {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Cricket Scores</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .match { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .live { background-color: #e6ffe6; }
        </style>
    </head>
    <body>
        <h1>Live Cricket Scores</h1>
        ${matches
          .map(
            (match) => `
            <div class="match ${
              match.innerText.includes("LIVE") ? "live" : ""
            }">
                <h3>${match.innerText}</h3>
                <a href="${match.link}" target="_blank">View details</a>
            </div>
        `
          )
          .join("")}
    </body>
    </html>`;
}

export function deactivate() {}
