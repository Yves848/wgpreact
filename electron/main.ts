import { app, BrowserWindow } from 'electron';
import { exec } from "child_process";
import path from 'node:path'
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
        reject(stdout as string);

      }
      resolve (stdout as string);
    });
  })
}

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
  console.log(app.getLocale());
  console.log(app.getPreferredSystemLanguages());
  console.log(app.getSystemLocale());
  var version: string  = '';
  try
  {
    version = await exexCommand("winget -v");
  }
  catch(e) {
    version = `Erreur : ${e}`;
  }
  console.log(`${version}`);
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'wingetposh2.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    fullscreenable: true,
  })

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
