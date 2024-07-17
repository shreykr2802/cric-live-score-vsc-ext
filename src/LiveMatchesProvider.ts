import * as vscode from 'vscode';
import { Match } from './types';

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
    return liveMatches.map(match => createMatchItem(match.innerText));
  }

  function refresh(): void {
    onDidChangeTreeData.fire();
  }

  return { provider, refresh };
}

function createMatchItem(label: string): MatchItem {
  return {
    label,
    collapsibleState: vscode.TreeItemCollapsibleState.None,
    contextValue: 'match'
  } as MatchItem;
}

interface MatchItem extends vscode.TreeItem {
  label: string;
}
