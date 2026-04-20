const fs = require('fs');
const buf = fs.readFileSync('C:/Users/MyPC/Desktop/travelapp/mongodb/mongodb-win32-x86_64-windows-7.0.14/bin/vc_redist.x64.exe');
// Search for ALL CAB headers (MSCF = 4D 53 43 46)
const cabSig = Buffer.from('MSCF');
// Search for OLE/MSI headers (D0 CF 11 E0 A1 B1 1A E1)
const msiSig = Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]);

console.log('=== All CAB positions ===');
let pos = -1;
let count = 0;
while ((pos = buf.indexOf(cabSig, pos + 1)) !== -1 && count < 50) {
  const sz = buf.readUInt32LE(pos + 8);
  if (sz > 1000 && sz < 50*1024*1024) {
    console.log('  CAB at:', pos, '(0x'+pos.toString(16)+')', 'size:', sz, '(' + (sz/1024).toFixed(0) + ' KB)');
  }
  count++;
}

console.log('\n=== All MSI/OLE positions ===');
pos = -1; count = 0;
while ((pos = buf.indexOf(msiSig, pos + 1)) !== -1 && count < 20) {
  console.log('  MSI at:', pos, '(0x'+pos.toString(16)+')');
  count++;
}
