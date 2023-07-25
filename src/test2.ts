const cols = require('../dist-electron/resource.json');

//console.log(cols['SearchId']);

const map = new Map(Object.entries(cols));
//console.log(map);

map.forEach((val,key) => {
  
  if (val == 'ID') {
    console.log(key);
  }
  
})


//console.log(f);

