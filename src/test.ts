import { exec, execFile, fork, spawn } from "child_process";
//import path, { resolve } from "path/posix";
import os from 'os';

function start() {
    //spawnSample('cmd.exe',['winget', '-v']);
    execSample('winget list');
}
function spawnSample(command: string, args: string[]) {
    const execProcess = spawn(command, args);
    console.log('spawn');
    console.log(execProcess.spawnfile);
    execProcess.on('spawn', () => {
        console.log('spawn on spawn');
    });
    execProcess.stdout.on('data', (data) => {
        //var sd: string = (data as string);
        //if (sd.match('winget')) {
          console.log(`spawn stdout: ${data}`);
        //}
        
    });
    execProcess.stderr.on('data', (data) => {
        console.log(`spawn on error ${data}`);
    });
    execProcess.on('exit', (code, signal) => {
        console.log(`spawn on exit code: ${code} signal: ${signal}`);
    });
    execProcess.on('close', (code: number, args: any[])=> {
        console.log(`spawn on close code: ${code} args: ${args}`);
    });
}

function execSample(args: string) {
  const execProcess = exec(args, { 'encoding': 'utf8' }, (error, stdout) => {
      var s : string[] = [];
      s = (stdout as string).split('\r\n');
      s.forEach((line,i) => {
        if (line.match('----------')) {
          console.log(s[i-1]);
        }
        if (line.match('winget$')) {
          console.log(line);
        }
      })
  });
  //console.log('exec spawn');
  //console.log(execProcess.spawnfile);
  execProcess.on('spawn', () => {
      //console.log('exec on spawn');
  });
  execProcess.on('error', (err) => {
      //console.log(`exec on error:${err}`);
  });
  execProcess.on('exit', (code, signal) => {
      //console.log(`exec on exit code: ${code} signal: ${signal}`);
  });
  execProcess.on('close', (code: number, args: any[])=> {
      //console.log(`exec on close code: ${code} args: ${args}`);
  });
}

let locale:string = Intl.DateTimeFormat().resolvedOptions().locale;
console.log(locale);

start();


// const { exec } = require('child_process');
// exec('winget search code', (error:any, stdout:string, stderr:any)=> {
//     console.log(stdout);
// })
