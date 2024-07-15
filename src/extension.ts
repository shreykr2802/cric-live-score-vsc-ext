import axios from "axios";
import * as vscode from "vscode";

interface Match {
  link: string;
  innerText: string;
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
		console.log(liveMatches);
        displayMatches(liveMatches);
      } catch (error) {
		console.log(error);
        vscode.window.showErrorMessage("Failed to fetch live cricket scores.");
      }
    }
  );

  context.subscriptions.push(disposable);

  setInterval(async () => {
    try {
      const liveMatches = await fetchLiveMatches();
      updateStatusBar(liveMatches[0]);
    } catch (error) {
      console.error("Failed to update scores:", error);
    }
  }, 5 * 60 * 1000);

  vscode.commands.executeCommand("cricketScores.showLiveScores");
}

async function fetchLiveMatches(): Promise<any> {
  const response = await axios.get("http://localhost:3000/live");
  console.log("reponse", response);
  return response;
}

function displayMatches(matches: Match[]) {
  const panel = vscode.window.createWebviewPanel(
    "cricketScores",
    "Live Cricket Scores",
    vscode.ViewColumn.One,
    {}
  );

  panel.webview.html = getWebviewContent(matches);
  updateStatusBar(matches[0]);
}

function updateStatusBar(match: Match) {
  if (match && match.innerText.includes("LIVE")) {
    statusBarItem.text = `$(pulse) ${match.innerText.split(",")[1].trim()}`;
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
