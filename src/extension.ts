
import * as vscode from "vscode";
import { createLiveMatchesProvider } from "./LiveMatchesProvider";
import { createDoneUpcomingProvider } from "./DoneUpcomingProvider";
import { fetchLiveMatches } from "./api";
import { Match } from "./types";
import { getDoneUpcomingMatches, getFirstLiveMatch, getLiveMatches, getMatchDataForStatusBar } from "./utils";

let statusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {
  console.log("Cricket Scores extension is now active!");

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);

  const liveMatchesData = await fetchLiveMatches();
  const liveMatches = createLiveMatchesProvider(getLiveMatches(liveMatchesData));
  const doneUpcoming = createDoneUpcomingProvider(getDoneUpcomingMatches(liveMatchesData));

  vscode.window.registerTreeDataProvider('live-matches', liveMatches.provider);
  vscode.window.registerTreeDataProvider('done-upcoming', doneUpcoming.provider);

  vscode.commands.registerCommand('cricketScores.refreshLiveMatches', () => liveMatches.refresh());
  vscode.commands.registerCommand('cricketScores.refreshDoneUpcoming', () => doneUpcoming.refresh());

  vscode.commands.registerCommand('cricketScores.openMatch', (match) => {
    vscode.window.showInformationMessage(`Opening match: ${match}`);
  });

  const disposable = vscode.commands.registerCommand(
    "cricketScores.showLiveScores",
    () => updateStatusBar(getFirstLiveMatch(liveMatchesData))
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand("cricketScores.showLiveScores");
}

function updateStatusBar(match: Match | undefined) {
  if (match) {
    const matchData = getMatchDataForStatusBar(match);
    statusBarItem.text = `$(pulse) ${matchData[0]} vs ${matchData[1]} - ${matchData[2]}`;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

export function deactivate() {}
