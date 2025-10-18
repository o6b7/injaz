module.exports = {
  apps: [
    {
      name: "injaz",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
