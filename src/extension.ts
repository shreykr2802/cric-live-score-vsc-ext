import * as vscode from "vscode";
import { createLiveMatchesProvider } from "./LiveMatchesProvider";
import { createDoneUpcomingProvider } from "./DoneUpcomingProvider";
import { fetchLiveMatchDetailsFromUrl, fetchLiveMatches } from "./api";
import { LiveMatch, Match } from "./types";
import {
  getDoneUpcomingMatches,
  getFirstLiveMatch,
  getLiveMatchDataForStatusBar,
  getLiveMatches,
  getMatchDataForStatusBar,
} from "./utils";
import { startSSE, stopSSE } from "./api/event";

let statusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
  console.log("Cricket Scores extension is now active!");

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);

  const liveMatchesData = await fetchLiveMatches();
  const liveMatches = createLiveMatchesProvider(
    getLiveMatches(liveMatchesData)
  );
  const doneUpcoming = createDoneUpcomingProvider(
    getDoneUpcomingMatches(liveMatchesData)
  );

  vscode.window.registerTreeDataProvider("live-matches", liveMatches.provider);
  vscode.window.registerTreeDataProvider(
    "done-upcoming",
    doneUpcoming.provider
  );

  vscode.commands.registerCommand("cricketScores.refreshMatches", () => {
    liveMatches.refresh();
    doneUpcoming.refresh();
  });

  vscode.commands.registerCommand("cricketScores.openMatch", (match: Match) => {
    vscode.window.showInformationMessage(`Match Highlight: ${match}`);
  });

  vscode.commands.registerCommand(
    "cricketScores.pinMatch",
    async (match: Match) => {
      updateFirstLoadStatusBar(match);
      startSSE(
        {
          url: `https://cric-api-gamma.vercel.app/livematch/liveUpdates?matchUrl=${match?.link}`,
          headers: {
            headers: { SECRET: process.env.SECRET },
          },
          onMessage: (data) => {
            updateLiveStatusBar(data);
          },
          onError: (error) => {
            console.error("SSE error:", error);
          },
        }
      );
      vscode.window.showInformationMessage("Match Pinned to Status Bar!");
    }
  );

  const disposable = vscode.commands.registerCommand(
    "cricketScores.showLiveScores",
    async () => {
      const liveMatch = getFirstLiveMatch(liveMatchesData);
      updateFirstLoadStatusBar(liveMatch);
      startSSE(
        {
          url: `https://cric-api-gamma.vercel.app/livematch/liveUpdates?matchUrl=${liveMatch?.link}`,
          headers: {
            headers: { SECRET: process.env.SECRET },
          },
          onMessage: (data) => {
            updateLiveStatusBar(data);
          },
          onError: (error) => {
            console.error("SSE error:", error);
          },
        }
      );
    }
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand("cricketScores.showLiveScores");
}

function updateFirstLoadStatusBar(match: Match | undefined) {
  if (match) {
    const matchData = getMatchDataForStatusBar(match);
    statusBarItem.text = `$(pulse) ${matchData}`;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

function updateLiveStatusBar(liveMatchData: LiveMatch) {
  if (liveMatchData) {
    const matchData = getLiveMatchDataForStatusBar(liveMatchData);
    statusBarItem.text = `$(pulse) ${matchData}`;
    statusBarItem.tooltip = `${matchData}`;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

export function deactivate() {
  stopSSE();
}
