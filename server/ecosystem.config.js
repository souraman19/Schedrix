module.exports = {
  apps: [
    {
      name: "ml-service",
      script: "src/ml_models_service/app.py",
      interpreter: "./tf-env/Scripts/python",
      watch: ["src/ml_models_service"],
      out_file: "./logs/ml-service-out.log",
      error_file: "./logs/ml-service-error.log",
    },
    {
      name: "server",
      script: "src/index.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register",
      watch: ["src"],
      out_file: "./logs/server-out.log",
      error_file: "./logs/server-error.log",
    },
    {
      name: "reminder-worker",
      script: "src/lib/queues/reminderWorker.ts",
      interpreter: "node",
      interpreter_args: "-r ts-node/register",
      watch: ["src/lib/queues"],
      out_file: "./logs/reminder-out.log",
      error_file: "./logs/reminder-error.log",
    },
  ],
};
