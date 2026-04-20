const fs = require('fs');
const buf = fs.readFileSync('C:/Users/MyPC/Desktop/travelapp/mongodb/mongodb-win32-x86_64-windows-7.0.14/bin/vc_redist.x64.exe');
// First CAB at 0x71200 = 463360
const cabOffset = 0x71200;
// CAB format: bytes 8-12 are the total cabinet size
const cabSize = buf.readUInt32LE(cabOffset + 8);
console.log('CAB at offset:', cabOffset, 'size:', cabSize, '(' + (cabSize/1024/1024).toFixed(2) + ' MB)');
if (cabSize > 0 && cabSize < 30 * 1024 * 1024) {
  const cabData = buf.slice(cabOffset, cabOffset + cabSize);
  fs.writeFileSync('C:/Users/MyPC/Desktop/travelapp/vc_extracted.cab', cabData);
  console.log('Extracted CAB to vc_extracted.cab');
} else {
  // Maybe search for more CABs
  let pos = 0;
  const cabSig = Buffer.from('MSCF');
  console.log('All CAB positions and sizes:');
  while ((pos = buf.indexOf(cabSig, pos + 1)) !== -1) {
    const sz = buf.readUInt32LE(pos + 8);
    console.log('  pos:', pos, '(0x'+pos.toString(16)+')', 'size:', sz, '(' + (sz/1024/1024).toFixed(2) + ' MB)');
  }
}
