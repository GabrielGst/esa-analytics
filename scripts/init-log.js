// scripts/init-logs.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const files = [
  'prod_flask-logs.log',
  'dev_flask-logs.log',
  // 'logs.log',
  // 'prod-error-logs.log', // to be used with right configuration of pm2 for loggin, which is not the case AON
  // 'prod-out-logs.log', // to be used with right configuration of pm2 for loggin, which is not the case AON
];

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
  console.log('Created logs/ directory');
}

files.forEach((file) => {
  const filePath = path.join(logDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`Created ${file}`);
  } else {
    console.log(`${file} already exists`);
  }
});
