/* eslint-disable no-unused-vars */
import express from 'express';
import session from 'express-session';
import { Redis } from 'ioredis'; 
import { RedisStore } from 'connect-redis'; 
import cookieParser from 'cookie-parser';

// 防止出现类型错误，强制 TypeScript 识别 express-session 的 SessionData 接口
// @ts-ignore
declare module 'express-session' {
  interface SessionData {
    views: number;
    serverId: string;
  }
}

// const redisClient = new Redis(); // 默认连接 localhost:6379
function createRedisClient() {
  return new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}

function createServer(port: number, id: string) {
  const app = express();
  app.use(cookieParser());
  const redisClient = createRedisClient();
  
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 600000 }, // 10分钟
    })
  );

  app.get('/', (req, res) => {
    if (!req.session.serverId) {
      req.session.serverId = id;
    }

    res.send(`
      <html>
        <body>
          <h1>Server: ${id}</h1>
          <p>Session ID: ${req.sessionID}</p>
          <p>Session Stored Server ID: ${req.session.serverId}</p>
        </body>
      </html>
    `);
  });

  app.listen(port, () => {
    console.log(`Server ${id} running on port ${port}`);
  });
}

createServer(3001, 'A');
createServer(3002, 'B');
createServer(3003, 'C');
createServer(3004, 'D');