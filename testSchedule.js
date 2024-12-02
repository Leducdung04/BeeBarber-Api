const schedule = require('node-schedule');

schedule.scheduleJob('test-job', new Date(Date.now() + 10000), () => {
  console.log("Test job executed at:", new Date());
});
