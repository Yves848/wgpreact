import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';

import path from 'node:path'
import { writeFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { execSample, execCommand } from '../src/Utilities/childProcesses';

import { WgProps } from '../src/Classes/cMain';

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

let wgProps: WgProps;


async function createWindow() {

  wgProps = new WgProps();
  await wgProps.getVersion();
  console.log(`version : ${wgProps.wgVersion}`);
  await wgProps.downloadResources();
  //console.log(wgProps.props);
  ipcMain.on('getTestInfo', (event, args) => {
    console.log(`received : ${args}`)
    event.returnValue = 'Coucou2'
  });

  ipcMain.on('list',async(event, args) => {
    const s = await execSample('winget list');
    event.sender.send('list-result',{s: s});
  });

  ipcMain.on('getCol', async (event,args) => {
    const key = await wgProps.getKey(args.col);
    event.sender.send('col',{'name':key});
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
