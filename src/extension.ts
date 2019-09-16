// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.fcFromTag",
    () => {
      // The code you place here will be executed every time your command is executed

      // Lookup the code editor.
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(
          `Make sure you select the text of a tag you want to create a function component for. 
		  (ie. if you want a new function component for <NewComponent/> select the text 'NewComponent', then execute this extension.`
        );
        return null;
      }

      // Get the selected text within the editor, split it by casing to an array, then join with '_'; so the following:
      // 'NewComponent' becomes 'new_component' => then use this as the filename.
      const cursorPosition = editor.selection.start;
      const wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
      const highlight = editor.document.getText(wordRange);
      const groupHighlight = highlight.match(/[A-Z][a-z]+/g);

      if (!groupHighlight) {
        vscode.window.showInformationMessage(
          `Make sure you select the text of a tag you want to create a function component for. Capitalization is necessary. 
			(ie. if you want a new function component for <NewComponent/> select the text 'NewComponent', then execute this extension.`
        );
        return null;
      }

      const newFilename = groupHighlight.join("_").toLocaleLowerCase();
      const filePath = path.join(
        vscode.workspace.rootPath!,
        `${newFilename}.tsx`
      );

      //if filepath exist, cancel, msg: not good.,
      if (fs.existsSync(filePath)) {
        vscode.window.showInformationMessage(
          `File already exists: ${filePath}`
        );
        return null;
      }

      fs.writeFileSync(
        filePath,
        `import React from "react"\n\nconst ${highlight} : React.FC= () : 
         => {\n\treturn <></>;\n}\n\nexport default ${highlight}`,
        "utf8"
      );

      // Show the new file in editor.
      const openPath = vscode.Uri.file(filePath);
      vscode.workspace.openTextDocument(openPath).then(doc => {
        vscode.window.showTextDocument(doc);
      });

      // Display a message box to the user
      vscode.window.showInformationMessage(
        `🚀Created new file for: ${filePath}`
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
