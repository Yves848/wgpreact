import { app, BrowserWindow, ipcMain } from 'electron';
import { exec } from "child_process";
import path from 'node:path'
import { readFileSync, writeFileSync } from 'fs';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import wgProp from '@/Classes/cMain';
import wgProperty from '@/Interfaces/IMain';

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

function exexCommand(args: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(args, { 'encoding': 'utf8' }, (error, stdout) => {
      if (error) {
        reject(error.message as string);
      }
      resolve(stdout as string);
    });
  })
}

let wingetProperties = new Map<string, string>();

function execSample(args: string): string {
  var result: string = '';
  const execProcess = exec(args, { 'encoding': 'utf8' }, (error, stdout) => {
    var s: string[] = [];
    s = (stdout as string).split('\r\n');
    s.forEach((line, i) => {
      if (line.match('----------')) {
        console.log(s[i - 1]);
      }
      if (line.match('winget$')) {
        console.log(line);
      }
    });
    result = (stdout as string);
  });

  execProcess.on('spawn', () => {
    //console.log('exec on spawn');
  });
  execProcess.on('error', (err) => {
    //console.log(`exec on error:${err}`);
  });
  execProcess.on('exit', (code, signal) => {
    //console.log(`exec on exit code: ${code} signal: ${signal}`);
  });
  execProcess.on('close', (code: number, args: any[]) => {
    //console.log(`exec on close code: ${code} args: ${args}`);
  });

  return result;
}

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

  ipcMain.on('getTestInfo',(event,args)=> {
    return ('coucou');
  })

  //console.log(`${version}`);

  let reqHeader = new Headers();
  reqHeader.append('Content-Type', 'text/xml');
  let initObject = {
    method: 'GET', headers: reqHeader,
  };
  const url = `https://raw.githubusercontent.com/microsoft/winget-cli/release-${version}/Localization/Resources/${locale}/winget.resw`
  //console.log(url);
  var resp = await fetch(url, initObject);
  var data = await resp.text();
  //console.log(data);

  const options = {
    ignoreAttributes: false,
    tagValueProcessor: (tagName, tagValue: any, jPath, hasAttributes, isLeafNode: boolean) => {
      if (isLeafNode) return tagValue;
      return "";
    }
  };
  const parser = new XMLParser(options);
  const json = parser.parse(data);
  //console.log(json.root.data.length);
  for (var i = 0; i < json.root.data.length; i++) {
    //console.log(`${json.root.data[i]["@_name"]} : ${json.root.data[i]["value"]}`);
    wingetProperties.set(json.root.data[i]["@_name"], json.root.data[i]["value"]);
  }
  //console.log(json.root.data[0])
  var js = JSON.stringify(Object.fromEntries(wingetProperties));
  writeFileSync(path.join(__dirname, "test.json"), js, {
    flag: 'w',
  });
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'wingetposh2.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
    fullscreenable: true,
  });

  //win.setMenu(null);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}


app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
