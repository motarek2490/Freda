const fs = require('fs');

async function main() {
  const res = await fetch('https://www.far7itna.com/_next/static/chunks/app/(public)/templates/page-18703b3642cd4e07.js');
  const js = await res.text();
  fs.writeFileSync('/tmp/templates_page.js', js);
  console.log('Saved templates_page.js, size:', js.length);

  // Let's also check other chunks from html
  const htmlRes = await fetch('https://www.far7itna.com/templates');
  const html = await htmlRes.text();
  const chunkMatches = [...html.matchAll(/\/static\/chunks\/[a-zA-Z0-9\-_./]+/g)].map(m => m[0]);
  console.log('Chunks:', chunkMatches);
  
  for (const chunk of chunkMatches) {
    try {
      const cRes = await fetch('https://www.far7itna.com/_next' + chunk);
      const cJs = await cRes.text();
      fs.writeFileSync('/tmp/' + chunk.replace(/\//g, '_'), cJs);
    } catch (e) {}
  }
  console.log('Downloaded chunks');
}

main().catch(console.error);
