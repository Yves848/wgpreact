import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';

import path from 'node:path'
import { writeFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { execSample, exexCommand } from '../src/Utilities/childProcesses';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']



let wingetProperties = new Map<string, string>();



async function createWindow() {
  var l = app.getLocale();
  var locale = `${l}-${l.toUpperCase()}`
  var version: string = '';
  try {
    version = await exexCommand("winget -v");
  }
  catch (e) {
    version = `Erreur : ${e}`;
  }

  ipcMain.on('getTestInfo', (event, args) => {
    console.log(`received : ${args}`)
    event.returnValue = 'Coucou2'
  })

  ipcMain.on('list',async(event, args) => {
    const s = await execSample('winget list');
    event.sender.send('list-result',{s: s});
  })

  let reqHeader = new Headers();
  reqHeader.append('Content-Type', 'text/xml');
  let initObject = {
    method: 'GET', headers: reqHeader,
  };
  const url = `https://raw.githubusercontent.com/microsoft/winget-cli/release-${version}/Localization/Resources/${locale}/winget.resw`
  var resp = await fetch(url, initObject);
  var data = await resp.text();
  const options = {
    ignoreAttributes: false,
    tagValueProcessor: (tagName, tagValue: any, jPath, hasAttributes, isLeafNode: boolean) => {
      if (isLeafNode) return tagValue;
      return "";
    }
  };
  const parser = new XMLParser(options);
  const json = parser.parse(data);
  for (var i = 0; i < json.root.data.length; i++) {
    wingetProperties.set(json.root.data[i]["@_name"], json.root.data[i]["value"]);
  }
  var js = JSON.stringify(Object.fromEntries(wingetProperties));
  writeFileSync(path.join(__dirname, "resource.json"), js, {
    flag: 'w',
  });
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'wingetposh2.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    fullscreenable: true,
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}
app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
