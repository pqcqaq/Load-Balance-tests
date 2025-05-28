import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';

const URL = 'http://127.0.0.1:9999/'; // nginx 代理入口
const CONCURRENCY = 50; // 并发数
const TOTAL_REQUESTS = 1_000_0 // 总请求数
const WAIT_TIME = 100; // 每次并发间隔时间（毫秒）

interface ResultStat {
  serverCount: Record<string, number>;
  sessionIds: Set<string>;
  minViews: number;
  maxViews: number;
}

async function sendRequest(cookie?: string): Promise<{ body: string; cookie?: string }> {
  const headers: Record<string, string> = {};
  if (cookie) headers['Cookie'] = cookie;

  const res = await fetch(URL, { headers, method: "GET" });
  const body = await res.text();
  const setCookie = res.headers.get('set-cookie') || undefined;

  return { body, cookie: setCookie };
}

describe('Nginx代理4后台服务Session共享和分布测试', () => {
  test('百万次请求分布及session共享检测', async () => {
    const serverCount: Record<string, number> = {};
    const sessionIds = new Set<string>();

    let sharedCookie: string | undefined;

    // 这里我们分批请求，防止一次 Promise.all 数百万请求导致资源耗尽
    // 并发控制简化版：每批1000个请求，循环直到100万
    const batchSize = CONCURRENCY;
    const batches = Math.ceil(TOTAL_REQUESTS / batchSize);

    for (let b = 0; b < batches; b++) {
      const promises = [] as Promise<{ body: string; cookie?: string }>[];
      for (let i = 0; i < batchSize && b * batchSize + i < TOTAL_REQUESTS; i++) {
        promises.push(sendRequest(sharedCookie));
      }
      const results = await Promise.all(promises);

      // 处理结果
      for (const { body, cookie } of results) {
        // 取出服务器id，views，sessionID，sessionStoredServerId
        const serverMatch = body.match(/<h1>Server: (.+?)<\/h1>/);
        const sessionIdMatch = body.match(/<p>Session ID: (.+?)<\/p>/);
        const sessionStoredServerIdMatch = body.match(/<p>Session Stored Server ID: (.+?)<\/p>/);

        if (!serverMatch || !sessionIdMatch || !sessionStoredServerIdMatch) continue;

        const serverId = serverMatch[1];
        const sessionId = sessionIdMatch[1];

        // 统计访问次数分布
        serverCount[serverId] = (serverCount[serverId] || 0) + 1;

        // session ID 集合
        sessionIds.add(sessionId);

        // 更新共享cookie（第一次请求会获得cookie）
        if (!sharedCookie && cookie) {
          const sid = cookie.split(';')[0];
          sharedCookie = sid;
        }
      }

      // 控制台打印进度
      if ((b + 1) % 100 === 0) {
        console.log(`已完成请求 ${(b + 1) * batchSize}`);
      }

      if (b < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
      }
    }

    console.log('各后台服务器请求分布统计:', serverCount);
    console.log('不同 sessionId 数量:', sessionIds.size);

    // 断言：请求总数是否达标
    const totalCount = Object.values(serverCount).reduce((a, b) => a + b, 0);
    console.log(`总请求数: ${totalCount}, 期望请求数: ${TOTAL_REQUESTS}`);
    
    expect(totalCount).toBeGreaterThan(TOTAL_REQUESTS * 0.95); // 允许5%误差

    // 断言：必须至少访问到2台服务器
    expect(Object.keys(serverCount).length).toBeGreaterThanOrEqual(2);

    // 断言：共享cookie应该存在
    expect(sharedCookie).toBeDefined();

  }, 60 * 10 * 1000); // 10分钟超时，视机能调整
});
