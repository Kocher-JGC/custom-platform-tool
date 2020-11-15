const { spawn } = require('child_process');

const child = spawn('echo', ['pwd'])

process.on('SIGINT', function () {
  console.log('Exit now!');
  process.exit();
});