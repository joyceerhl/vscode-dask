// import { ansicolor, ParsedSpan } from 'ansicolor' // along with type definitions

const { parse } = require ('ansicolor')
const ret = parse("\u001b[0;32m<ipython-input-8-b7fe370ef34b>\u001b[0m in \u001b[0;36m<module>\u001b[0;34m\u001b[0m\n\u001b[0;32m----> 1\u001b[0;31m \u001b[0mdata\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0msegmentTime\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0;34m\"./2021/activity_6695646668.gpx\"\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[0m\u001b[1;32m      2\u001b[0m \u001b[0mdf\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mdata\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;36m1\u001b[0m\u001b[0;34m]\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m      3\u001b[0m \u001b[0mname\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mdata\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;36m0\u001b[0m\u001b[0;34m]\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m      4\u001b[0m \u001b[0mtime\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mdf\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;34m'Time'\u001b[0m\u001b[0;34m]\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mmin\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n\u001b[1;32m      5\u001b[0m \u001b[0mellapsed_time\u001b[0m \u001b[0;34m=\u001b[0m \u001b[0mdf\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;34m'Time'\u001b[0m\u001b[0;34m]\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mmax\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0;34m)\u001b[0m \u001b[0;34m-\u001b[0m \u001b[0mdf\u001b[0m\u001b[0;34m[\u001b[0m\u001b[0;34m'Time'\u001b[0m\u001b[0;34m]\u001b[0m\u001b[0;34m.\u001b[0m\u001b[0mmin\u001b[0m\u001b[0;34m(\u001b[0m\u001b[0;34m)\u001b[0m\u001b[0;34m\u001b[0m\u001b[0;34m\u001b[0m\u001b[0m\n")

let parsedHTML = [[]];
let executionCount = -1;
ret.spans.forEach(span => {
        if (span.text === '\n') {
            parsedHTML.push([]);
            return;
        }

        const lastArr = parsedHTML[parsedHTML.length - 1];
        const inputIndex = /^\<ipython-input-(\d)-/.exec(span.text);
        if (inputIndex && inputIndex.length === 2) {
            executionCount = Number(ret[1])
            lastArr.push(`<span style="${span.css}">${escape(span.text)}</span>`);
            return;
        }

        const lineNumber = /^\-{4}> (\d)/.exec(span.text);
        if (lineNumber && lineNumber.length === 2) {
            const ln = Number(lineNumber[1]);
            lastArr.push(`<span style="${span.css}"><a href="#" data-href="command:workbench.action.OpenQuickPick" title="command:workbench.action.OpenQuickPick">${escape(span.text)}</a></span>`);
            return;
        }
        
        lastArr.push(`<span style="${span.css}">${escape(span.text)}</span>`);
});

const htmlStr = parsedHTML.map(arr => {
    return '<span>' + arr.join('') + '</span>';
}).join('');

console.log(htmlStr);