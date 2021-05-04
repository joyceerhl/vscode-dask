/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

// We've set up this sample using CSS modules, which lets you import class
// names into JavaScript: https://github.com/css-modules/css-modules
// You can configure or change this in the webpack.config.js file.
import * as style from './style.css';
import type { NotebookRendererApi } from 'vscode-notebook-renderer';
const { parse } = require('ansicolor')

interface IRenderInfo {
	container: HTMLElement;
	mimeType: string;
	data: any;
	notebookApi: NotebookRendererApi<unknown>;
}

// color codes from ansicolor
// const colorCodes      = [   'black',      'red',      'green',      'yellow',      'blue',      'magenta',      'cyan', 'lightGray', '', 'default']
//     , colorCodesLight = ['darkGray', 'lightRed', 'lightGreen', 'lightYellow', 'lightBlue', 'lightMagenta', 'lightCyan', 'white', '']

const nameMapping: { [key: string]: string } = {
	'black': '--vscode-terminal-ansiBlack',
	'red': '--vscode-terminal-ansiRed',
	'green': '--vscode-terminal-ansiGreen',
	'yellow': '--vscode-terminal-ansiYellow',
	'blue': '--vscode-terminal-ansiBlue',
	'magenta': '--vscode-terminal-ansiMagenta',
	'cyan': '--vscode-terminal-ansiCyan',
	'white': '--vscode-terminal-ansiWhite',
	'lightGray': '--vscode-terminal-ansiWhite',
	'lightBlack': '--vscode-terminal-ansiBrightBlack',
	'lightRed': '--vscode-terminal-ansiBrightRed',
	'lightGreen': '--vscode-terminal-ansiBrightGreen',
	'lightYellow': '--vscode-terminal-ansiBrightYellow',
	'lightBlue': '--vscode-terminal-ansiBrightBlue',
	'lightMagenta': '--vscode-terminal-ansiBrightMagenta',
	'lightCyan': '--vscode-terminal-ansiBrightCyan',
	'lightWhite': '--vscode-terminal-ansiBrightWhite'
};

function updateColor(spanEl: HTMLSpanElement, span: any) {
	if (span.color) {
		const name = span.color.name;
		const cssVariable = nameMapping[name];
		spanEl.setAttribute('style', `color: var(${cssVariable});`);
	} else {
		spanEl.setAttribute('style', span.css);
	}
}

function attachLink(spanEl: HTMLSpanElement, text: string, executionCount: number, lineNumber: number) {
	const aEl = document.createElement('a');
	aEl.href = `command:bje.revealrange?\"${executionCount},${lineNumber}\"`;
	aEl.setAttribute('data-href', `command:bje.revealrange?\"${executionCount},${lineNumber}\"`);
	aEl.text = text;
	spanEl.appendChild(aEl);
}

function renderOutput(pre: HTMLElement, datas: string[]) {
	datas.forEach((data) => {
		let parsedHTML: HTMLSpanElement[] = [document.createElement('span')];
		let executionCount = -1;
		const ret = parse(data);
		ret.spans.forEach((span: any) => {
			if (span.text === '\n') {
				parsedHTML.push(document.createElement('span'));
				return;
			}

			const lastArr = parsedHTML[parsedHTML.length - 1];
			const inputIndexMatches = /^\<ipython-input-(\d)/.exec(span.text);
			if (inputIndexMatches && inputIndexMatches.length === 2) {
				executionCount = Number(inputIndexMatches[1])
				const spanEl = document.createElement('span');
				updateColor(spanEl, span);
				attachLink(spanEl, span.text, executionCount, 1);
				lastArr.appendChild(spanEl);
				return;
			}

			const errorLineNumberMatches = /^\-{4}> (\d)/.exec(span.text);
			if (errorLineNumberMatches && errorLineNumberMatches.length === 2) {
				const lineNumber = Number(errorLineNumberMatches[1]);
				const spanEl = document.createElement('span');
				updateColor(spanEl, span);
				attachLink(spanEl, span.text, executionCount, lineNumber);
				lastArr.appendChild(spanEl);
				return;
			}

			const spanEl = document.createElement('span');
			updateColor(spanEl, span);
			spanEl.textContent = span.text;
			lastArr.appendChild(spanEl);
		});

		parsedHTML.forEach(el => {
			pre.appendChild(el);
		});
	});
}


// This function is called to render your contents.
export function render({ container, mimeType, data }: IRenderInfo) {
	// Format the JSON and insert it as <pre><code>{ ... }</code></pre>
	// Replace this with your custom code!
	const pre = document.createElement('pre');
	pre.classList.add(style.json);

	renderOutput(pre, data.traceback);
	container.appendChild(pre);
}

if (module.hot) {
	module.hot.addDisposeHandler(() => {
		// In development, this will be called before the renderer is reloaded. You
		// can use this to clean up or stash any state.
	});
}
