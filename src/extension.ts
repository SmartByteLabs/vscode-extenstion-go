// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const templateString = (structName:string, capitalizedFieldName:string, fieldType:string, fieldName:string) => `
func (s *${structName}) Get${capitalizedFieldName}() ${fieldType} {
	var out ${fieldType}
	if s == nil {
		return out
	}
	return s.${fieldName}
}

func (s *${structName}) Set${capitalizedFieldName}(value ${fieldType}) {
	if s == nil {
		return
	}
	s.${fieldName} = value
}
`;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.generateGettersSetters', () => {
		const editor = vscode.window.activeTextEditor;
	  if (editor) {
		const document = editor.document;
		const selection = editor.selection;
  
		const text = document.getText(selection);
  
		const re = /type\s+(\w+)\s+struct\s+{([\s\S]*?)}/g;
		const matches = re.exec(text);
  
		if (matches) {
		  const structName = matches[1];
		  const structBody = matches[2];
  
		  const fields = structBody.split(/\r?\n/).filter(line => line.trim() !== '').map(line => {
			const parts = line.trim().split(' ');
			const fieldName = parts[0];
			const fieldType = parts[1];
			return { name: fieldName, type: fieldType };
		  });
  
		  const getterSetterText = fields.map(field => {
			const fieldName = field.name;
			const fieldType = field.type;
  
			const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  
			return templateString(structName,capitalizedFieldName, fieldType, fieldName)

		  }).join('\n\n');
  
		  editor.edit(editBuilder => {
			editBuilder.replace(selection, text +'\n'+ getterSetterText);
		  });
		}
	  }
	});
  
	context.subscriptions.push(disposable);
}  

// This method is called when your extension is deactivated
export function deactivate() {}
