var cols = require('../dist-electron/resource.json');
//console.log(cols['SearchId']);
var map = new Map(Object.entries(cols));
//console.log(map);
map.forEach(function (key, val) {
    if (key == 'ID') {
        console.log(val);
    }
});
//console.log(f);
