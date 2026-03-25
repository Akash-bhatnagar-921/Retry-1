const { Queue, Worker } = require("bullmq");

// Queue setup
const queue = new Queue("emailQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Worker setup
const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job : ", job.name);
    console.log("Sending email to : ", job.data.email);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
);

module.exports = { queue, worker };
