module.exports = {
  apps: [
    {
      name: 'qwer_dev', // 개발 모드
      script: 'node_modules/.bin/nest',
      args: 'start --watch',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'qwer_prod', // 프로덕션 모드
      script: 'dist/main.js',
      interpreter: 'node',
      env_production: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster',
      instances: 2, // CPU 2개 사용
      autorestart: true,
      watch: false,
    },
  ],
};
