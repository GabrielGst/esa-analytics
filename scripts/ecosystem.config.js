module.exports = {
  apps : [{
    name: "industry-analytics-prod",
    script: "npm",
    args: "run start",
    error_file: "logs/prod-error-logs.log", // default to $HOME/.pm2/logs/<app name>-error-<pid>.log
    out_file: "logs/prod-out-logs.log", // default to $HOME/.pm2/logs/<app name>-out-<pid>.log
  },
  // {
  //   script: './service-worker/',
  //   watch: ['./service-worker']
  // }
],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
