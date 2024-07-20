import { LiveMatch, Match } from "../types";

const liveMatchesTypes = [
  "LIVE",
  "DELAYED",
  "TEA",
  "LUNCH",
  "DRINKS",
  "INNINGS BREAK",
  "STUMPS",
];

function getFirstLiveMatch(matches: Match[]) {
  return matches.find((match) =>
    liveMatchesTypes.includes(match.innerText.split("&&")[0])
  );
}

function getMatchDataForStatusBar(match: Match) {
  const matchData = match.innerText.split("&&");
  const regex = /\(\d?\d?(\.\d+)? ov\)|\(\d?\d?(\.\d+)?\/\d+ ov,/;
  const team1 = matchData[2].trim();
  const team2 = matchData[4].trim();
  const currentScore = regex.test(matchData[5])
    ? matchData[5].trim()
    : matchData[3].trim();
  return `${team1} vs ${team2} - ${currentScore}`;
}

function getLiveMatchDataForStatusBar(liveMatch: LiveMatch) {
  const isTestMatch = liveMatch[1].value.includes("Test");
  if(isTestMatch) {
    const team1 = liveMatch[2].value;
    const team2 = liveMatch[4].value;
    const team1Score = liveMatch[3].value;
    const team2Score = liveMatch[5].value;
    return `${team1}(${team1Score}) vs ${team2}(${team2Score})`;
  }
  return `${liveMatch[2].value} vs ${liveMatch[4].value} - ${liveMatch[5].value ?? liveMatch[3].value}`;
}

function getMatchDataForActivityBar(matchText: string) {
  const matchData = matchText.split("&&");
  const regex = /\(\d?\d?(\.\d+)? ov\)|\(\d?\d?(\.\d+)?\/\d+ ov,/;
  const team1 = matchData[2].trim();
  const team2 = matchData[4].trim();
  const currentScore = regex.test(matchData[5])
    ? matchData[5].trim()
    : matchData[3].trim();
  const currentStatus = regex.test(matchData[5])
    ? matchData[6].trim()
    : matchData[5];
  return `${team1} ${currentScore} ${team2} - ${currentStatus}`;
}

function getLiveMatches(matches: Match[]) {
  return matches.filter((match) =>
    liveMatchesTypes.includes(match.innerText.split("&&")[0])
  );
}

function getDoneUpcomingMatches(matches: Match[]) {
  return matches.filter(
    (match) => !liveMatchesTypes.includes(match.innerText.split("&&")[0])
  );
}

function getSantizedMatchesData(matches: Match[]) {
  return matches.map((match) => ({
    innerText: match.innerText.replaceAll("&&", " ").replaceAll("null", ""),
    link: match.link,
    text: match.innerText,
  }));
}

export {
  liveMatchesTypes,
  getFirstLiveMatch,
  getMatchDataForStatusBar,
  getLiveMatches,
  getDoneUpcomingMatches,
  getSantizedMatchesData,
  getMatchDataForActivityBar,
  getLiveMatchDataForStatusBar
};
