module.exports = {
  apps: [{
    name: 'encuestas-backend',
    script: 'server.js',
    cwd: '/var/www/encuestas/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5002
    },
    error_file: '/var/log/pm2/encuestas-backend-error.log',
    out_file: '/var/log/pm2/encuestas-backend-out.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    max_memory_restart: '300M'
  }]
};

