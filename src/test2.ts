import { mkdirSync } from 'fs';
import * as path from 'path';
const cols = require('../dist-electron/resource.json');

//console.log(cols['SearchId']);

const map = new Map(Object.entries(cols));
//console.log(map);

// map.forEach((val,key) => {
  
//   if (val == 'ID') {
//     console.log(key);
//   }
  
// })


//console.log(f);

const rsPath: string = path.join(__dirname, 'v.1.5.1881');
console.log(rsPath);
mkdirSync('D:\\git\\wgpreact\\dist-electron\\v1.5.1881');