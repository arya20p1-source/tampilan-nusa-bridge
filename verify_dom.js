const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

const regex = /getElementById\(['"]([^'"]+)['"]\)/g;
const ids = new Set();
let match;
while ((match = regex.exec(js)) !== null) {
  ids.add(match[1]);
}

const missing = [];
for (const id of ids) {
  if (!html.includes('id="' + id + '"') && !html.includes("id='" + id + "'")) {
    missing.push(id);
  }
}
console.log('Unmatched getElementById IDs:', missing);

// Check all href="#..." anchors
const hrefRegex = /href="#([^"]+)"/g;
const hrefs = new Set();
while ((match = hrefRegex.exec(html)) !== null) {
  hrefs.add(match[1]);
}
const missingHrefs = [];
for (const h of hrefs) {
  if (!html.includes('id="' + h + '"') && !html.includes("id='" + h + "'")) {
    missingHrefs.push(h);
  }
}
console.log('Unmatched href targets in HTML:', missingHrefs);
