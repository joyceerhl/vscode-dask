// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('bje.revealrange', (...args) => {
        const arg = args[0];

        if (!arg) {
            return;
        }

        const nums = arg.split(/,/);
        if (nums.length !== 2) {
            return;
        }

        const extCnt = Number(nums[0]);
        const ln = Number(nums[1]);
        const activeEditor = vscode.window.activeNotebookEditor;
        if (!activeEditor) {
            return;
        }

        const document = activeEditor.document;
        const cell = document.getCells().find((cell: vscode.NotebookCell) => {
            return cell.latestExecutionSummary?.executionOrder === extCnt;
        });

        if (cell) {
            vscode.commands.executeCommand('vscode.open', cell.document.uri, {
                selection: new vscode.Range(ln - 1, 0, ln - 1, 0)
            });
        }
    }));

}

// This method is called when your extension is deactivated
export function deactivate() { }
