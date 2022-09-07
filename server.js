import path from 'path';
import Express from 'express';
import { createStore } from 'redux';
import stream from 'stream';
import appReducer from './reducer.js';

const app = Express();
const port = 3000;

const store = createStore(appReducer);
app.get("/list", (req, res) => {
    var state = store.getState();

    res.send(renderFullPage(JSON.stringify(state.list, null, "\t").replace(/(.*)\u0022([\w]+)\u0022(:.*)/ig,"$1$2$3")));
});

app.get("/scan", (req, res) => {
    store.dispatch({ type: 'scan' })

    res.send("<h1>Files scanned</h1><script>window.location='/list';</script>");
});

app.get("/download-state", (req, res) => {
    var state = store.getState();
    var fileContents = Buffer.from(JSON.stringify(state.list, null, "\t").replace(/(.*)\u0022([\w]+)\u0022(:.*)/ig, "$1$2$3"), "utf-8");
    var readStream = new stream.PassThrough();
    readStream.end(fileContents);

    res.set('Content-disposition', 'attachment; filename=state.txt');
    res.set('Content-Type', 'text/plain');

    readStream.pipe(res);
});

app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});

function renderFullPage(html) {
    var state = store.getState();

    return `
    <!doctype html>
    <html>
      <head>
        <style>
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }

        li {
          display: inline;
        }
        #root {white-space:pre}
        </style>
        <title>File reader app</title>
      </head>
      <body>
        <h2>File reader app</h2>
        <div id="nav">
            <ul>
                <li><a href="/list">List</a></li>
                <li><a href="/scan">Scan</a></li>
                <li><a href="/download-state">Download state</a></li>
            </ul>
        </div>
        <br />
        <div><b>Path for scan</b>:${state.path}</div>
        <div id="root"><b>Files found after scan</b>: ${html}</div>
        
        <script src="client.js"></script>
      </body>
    </html>
    `;
}