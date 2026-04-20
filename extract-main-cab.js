const fs = require('fs');
const buf = fs.readFileSync('C:/Users/MyPC/Desktop/travelapp/mongodb/mongodb-win32-x86_64-windows-7.0.14/bin/vc_redist.x64.exe');
const cabOffset = 650584; // 0x9ed58
const cabSize = buf.readUInt32LE(cabOffset + 8);
console.log('Extracting CAB at offset:', cabOffset, 'size:', cabSize, '(' + (cabSize/1024/1024).toFixed(2) + ' MB)');
const cabData = buf.slice(cabOffset, cabOffset + cabSize);
fs.writeFileSync('C:/Users/MyPC/Desktop/travelapp/vc_main.cab', cabData);
console.log('Done - saved to vc_main.cab');
