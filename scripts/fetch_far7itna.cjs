const fs = require('fs');

async function main() {
  const templates = JSON.parse(fs.readFileSync('/tmp/far7itna_templates.json', 'utf8'));
  console.log('Total templates to import:', templates.length);
  templates.forEach((t, i) => {
    console.log(`${i + 1}. [${t.template_key}] ${t.name} (type: ${t.event_type}) - prices: ${JSON.stringify(t.prices)}`);
  });
}

main().catch(console.error);
