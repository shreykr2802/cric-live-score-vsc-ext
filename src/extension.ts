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
import { getLiveUpdatesScore } from "./api/event";

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
      try {
        const liveMatchData = await fetchLiveMatchDetailsFromUrl(match.link);
        updateLiveStatusBar(liveMatchData);
        // startLiveFetch(match.link);
        vscode.window.showInformationMessage("Match Pinned to Status Bar!");
      } catch (err) {
        console.log("err", err);
        vscode.window.showErrorMessage("Pinning Match Failed");
      }
    }
  );

  const disposable = vscode.commands.registerCommand(
    "cricketScores.showLiveScores",
    async () => {
      try {
        const liveMatch = getFirstLiveMatch(liveMatchesData);
        // if (liveMatch) {
        //   const liveMatchData = await fetchLiveMatchDetailsFromUrl(
        //     liveMatch.link
        //   );
        //   updateLiveStatusBar(liveMatchData);
        // }
        const data = await getLiveUpdatesScore(liveMatch?.link);
        if (data) {
          console.log("event data --", data);
          updateLiveStatusBar(data);
        }
      } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage("Pinning Match Failed");
      }
    }
  );

  context.subscriptions.push(disposable);
  vscode.commands.executeCommand("cricketScores.showLiveScores");
}

/* not used anymore
// function updateStatusBar(match: Match | undefined) {
//   if (match) {
//     const matchData = getMatchDataForStatusBar(match);
//     statusBarItem.text = `$(pulse) ${matchData[0]} vs ${matchData[1]} - ${matchData[2]}`;
//     statusBarItem.show();
//   } else {
//     statusBarItem.hide();
//   }
// }
*/

function updateLiveStatusBar(liveMatchData: LiveMatch) {
  if (liveMatchData) {
    const matchData = getLiveMatchDataForStatusBar(liveMatchData);
    statusBarItem.text = `$(pulse) ${matchData[0]} vs ${matchData[1]} - ${matchData[2]}`;
    statusBarItem.tooltip = `${matchData[0]} vs ${matchData[1]} - ${matchData[2]}`;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

// function startLiveFetch(liveMatch: string){
//   setInterval(async ()=>{
//     try {
//       const liveMatchData = await fetchLiveMatchDetailsFromUrl(liveMatch);
//       updateLiveStatusBar(liveMatchData);
//     } catch (err) {
//       console.log("err", err);
//     }
//   },10000)
// }

export function deactivate() {}
