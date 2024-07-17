import * as vscode from 'vscode';
import { Match, MatchItem } from './types';
import { getSantizedMatchesData } from './utils';

export function createLiveMatchesProvider(liveMatches: Match[]) {
  const onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  const provider: vscode.TreeDataProvider<MatchItem> = {
    onDidChangeTreeData: onDidChangeTreeData.event,
    getTreeItem: (element: MatchItem) => element,
    getChildren: (element?: MatchItem) => {
      if (!element) {
        return Promise.resolve(getLiveMatches());
      }
      return Promise.resolve([]);
    }
  };

  function getLiveMatches(): MatchItem[] {
    return getSantizedMatchesData(liveMatches).map(match => createMatchItem(match));
  }

  function refresh(): void {
    onDidChangeTreeData.fire();
  }

  return { provider, refresh };
}

function createMatchItem(match: Match): MatchItem {
  return {
    label: match.innerText,
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    contextValue: 'match',
    command: {
      command: 'cricketScores.openMatch',
      title: 'Open Match',
      arguments: [match.innerText]
    },
  } as MatchItem;
}
