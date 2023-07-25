import { exec } from "child_process";

export function exexCommand(args: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(args, { 'encoding': 'utf8' }, (error, stdout) => {
      if (error) {
        reject(error.message as string);
      }
      resolve(stdout as string);
    });
  })
}

export function execSample(args: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    var result: string = '';
    var ok = false;
    const execProcess = exec(args, { 'encoding': 'utf8' }, (error, stdout) => {
      var s: string[] = [];
      s = (stdout as string).split('\r\n');
      s.forEach((line, i) => {
        if (line.match('----------')) {
          // extract columns properties.....
          // (s[i-1])
          ok = true;
        }
        if (ok) {
          if (!line.match('----------')) {
          result = result + line+'\n';
          }
        }
      });
      console.log('result');  
      resolve(result);
    });
  });
}