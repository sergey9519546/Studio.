const { spawn } = require('child_process');

console.log('Testing frontend build...');

const buildProcess = spawn('npm', ['run', 'build:client'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

buildProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Frontend build successful!');
    console.log('🎉 Frontend is ready for deployment');
  } else {
    console.log('❌ Frontend build failed');
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('Failed to start build process:', error);
  process.exit(1);
});
