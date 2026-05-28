module.exports = {
  apps: [{
    name: 'hermes-web',
    script: './.next/standalone/server.js',
    cwd: '/root/projects/onyx-web',
    env: {
      NODE_ENV: 'production',
      PORT: 3456,
      HOSTNAME: '127.0.0.1',
    }
  }]
};
