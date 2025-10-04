import cluster from 'cluster';
import os from 'os';
import http from 'http';
import app from './app.js';
import { connectDB } from './config/dbs/mongo.js';
import { connectRedis } from '@/config/dbs/redis.js';
import getPublicIP from './utils/getPublicIP.js';
import env from '@/config/env.js';

if (cluster.isPrimary) {
  const numCPUs = env.NODE_ENV === 'production' ? os.availableParallelism() : 1;
  console.log(`🧠 Primary process ${process.pid} running`);
  console.log(`🚀 Launching ${numCPUs} workers on...\n`);

  console.info(`  ➡️  http://localhost:${env.PORT}`);
  console.info(`  ➡️  http://${getPublicIP()}:${env.PORT}\n`);
  console.log(
    `/---------------Server is using ${numCPUs} cpus out of ${os.availableParallelism()} cpus-------------/\n`
  );

  let readyWorkers = 0;
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.on('message', (msg) => {
      if (msg === 'ready') {
        readyWorkers++;
        if (readyWorkers === numCPUs) {
          console.log(`\n✅ All ${numCPUs} workers are ready!\n`);
        }
      }
    });
  }

  if (env.NODE_ENV === 'production') {
    cluster.on('exit', (worker, _code, _signal) => {
      console.log(`\n❌ Worker ${worker.process.pid} died`);
      console.log('🔄 Restarting new worker...');
      cluster.fork();
    });
  }
} else {
  (async () => {
    try {
      await connectDB();
      await connectRedis();

      const server = http.createServer(app);

      server.listen(env.PORT, () => {
        console.log(`✅ Server listening for Worker ${process.pid}`);
        if (process.send) process.send('ready');
      });
    } catch (error) {
      console.error(
        `❌ Server failed to start Worker ${process.pid}: \nError: ${error}`
      );
      process.exit(1);
    }
  })();
}
