"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
function start() {
    //spawnSample('cmd.exe',['winget', '-v']);
    execSample('winget list');
}
function spawnSample(command, args) {
    var execProcess = (0, child_process_1.spawn)(command, args);
    console.log('spawn');
    console.log(execProcess.spawnfile);
    execProcess.on('spawn', function () {
        console.log('spawn on spawn');
    });
    execProcess.stdout.on('data', function (data) {
        //var sd: string = (data as string);
        //if (sd.match('winget')) {
        console.log("spawn stdout: ".concat(data));
        //}
    });
    execProcess.stderr.on('data', function (data) {
        console.log("spawn on error ".concat(data));
    });
    execProcess.on('exit', function (code, signal) {
        console.log("spawn on exit code: ".concat(code, " signal: ").concat(signal));
    });
    execProcess.on('close', function (code, args) {
        console.log("spawn on close code: ".concat(code, " args: ").concat(args));
    });
}
function execSample(args) {
    var execProcess = (0, child_process_1.exec)(args, { 'encoding': 'utf8' }, function (error, stdout) {
        var s = [];
        s = stdout.split('\r\n');
        s.forEach(function (line, i) {
            if (line.match('----------')) {
                console.log(s[i - 1]);
            }
            if (line.match('winget$')) {
                console.log(line);
            }
        });
    });
    //console.log('exec spawn');
    //console.log(execProcess.spawnfile);
    execProcess.on('spawn', function () {
        //console.log('exec on spawn');
    });
    execProcess.on('error', function (err) {
        //console.log(`exec on error:${err}`);
    });
    execProcess.on('exit', function (code, signal) {
        //console.log(`exec on exit code: ${code} signal: ${signal}`);
    });
    execProcess.on('close', function (code, args) {
        //console.log(`exec on close code: ${code} args: ${args}`);
    });
}
var locale = Intl.DateTimeFormat().resolvedOptions().locale;
console.log(locale);
start();
// const { exec } = require('child_process');
// exec('winget search code', (error:any, stdout:string, stderr:any)=> {
//     console.log(stdout);
// })
