const fs = require('fs');
const buf = fs.readFileSync('C:/Users/MyPC/Desktop/travelapp/mongodb/mongodb-win32-x86_64-windows-7.0.14/bin/mongod.exe');
const peOffset = buf.readUInt32LE(0x3C);
const numSections = buf.readUInt16LE(peOffset + 6);
const optHeaderSize = buf.readUInt16LE(peOffset + 20);
const sectionOffset = peOffset + 24 + optHeaderSize;
const sections = [];
for (let i = 0; i < numSections; i++) {
  const base = sectionOffset + i * 40;
  sections.push({
    name: buf.slice(base, base + 8).toString().replace(/\x00/g, ''),
    vaddr: buf.readUInt32LE(base + 12),
    rawOffset: buf.readUInt32LE(base + 20),
    rawSize: buf.readUInt32LE(base + 16)
  });
}
function rvaToFile(rva) {
  for (const s of sections) {
    if (rva >= s.vaddr && rva < s.vaddr + s.rawSize)
      return rva - s.vaddr + s.rawOffset;
  }
  return -1;
}
const importRVA = 0x3670e44;
let fileOff = rvaToFile(importRVA);
const dlls = [];
for (let i = 0; i < 200; i++) {
  const nameRVA = buf.readUInt32LE(fileOff + i * 20 + 12);
  if (nameRVA === 0) break;
  const nameOff = rvaToFile(nameRVA);
  if (nameOff < 0) break;
  let name = '';
  for (let j = nameOff; j < nameOff + 64 && buf[j]; j++) name += String.fromCharCode(buf[j]);
  dlls.push(name);
}
console.log('DLLs imported by mongod.exe:');
dlls.forEach(d => console.log(' -', d));
