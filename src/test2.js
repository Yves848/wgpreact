"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var cols = require('../dist-electron/resource.json');
//console.log(cols['SearchId']);
var map = new Map(Object.entries(cols));
//console.log(map);
// map.forEach((val,key) => {
//   if (val == 'ID') {
//     console.log(key);
//   }
// })
//console.log(f);
var rsPath = path.join(__dirname, 'v.1.5.1881');
console.log(rsPath);
(0, fs_1.mkdirSync)('D:\git\wgpreact\dist-electron\v1.5.1881');
