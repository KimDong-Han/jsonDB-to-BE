module.exports = {
  apps: [
    {
      name: 'dev', // 개발 모드 이름
      script: 'node_modules/.bin/nest',
      args: 'start --watch',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'prod', // 프로덕션 모드 이름
      script: 'dist/main.js',
      interpreter: 'node',
      env_production: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster', // 클러스터 모드
      instances: 'max', // CPU 4개 사용, 'max'로 하면 최대 CPU 코어 사용
      autorestart: true,
      watch: false,
    },
  ],
};
