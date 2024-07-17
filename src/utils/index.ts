import { Match } from "../types";

const liveMatchesTypes = ["LIVE", "DELAYED", "TEA", "LUNCH", "DRINKS"];

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
  return [team1, team2, currentScore];
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
};
