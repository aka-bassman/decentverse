import { createClient, RedisClientType } from 'redis';

export interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}

export class Rtdb {
  client: RedisClientType;
  constructor(options?: RedisOptions) {
    this.client = createClient(options);
    this.client.on('error', (err) => console.log('Redis Client Error', err));
  }
  async init(): Promise<boolean> {
    await this.client.connect();
    return true;
  }
  async test(): Promise<boolean> {
    if (!this.client) return false;
    const charNum = 5000;
    const tryNum = 10;
    const batchNum = charNum;
    const maxDigits = 13;
    const data: any[] = new Array(charNum).fill(0).map((_, idx) => {
      const x = Math.floor(Math.random() * 8000);
      const y = Math.floor(Math.random() * 8000);
      const score = convToScore(x, y, maxDigits);
      const link =
        'https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=wideeyed&logNo=221428664697';
      return { idx, x, y, score };
    });
    // await this.client.zAdd("test", { score: 13, value: "val" });
    await this.client.del('world');
    await this.client.del('character');
    for (let i = 0; i < charNum; i++) {
      await this.client.zAdd('world', {
        score: data[i].score,
        value: data[i].idx.toString(),
      });
      await this.client.hSet('character', data[i].idx, JSON.stringify(data[i]));
    }
    let totalTime = 0;
    let num = 0;
    for (let i = 0; i < tryNum; i++) {
      await Promise.all(
        new Array(batchNum).fill(0).map(async (_, idx) => {
          const prefix = convToScore(
            Math.floor(Math.random() * 8),
            Math.floor(Math.random() * 8),
            3
          );
          const [min, max] = [
            prefix + new Array(20).fill('0').join(''),
            prefix + new Array(20).fill('1').join(''),
          ];
          const start = new Date().getTime();
          const res = await this.client.zRange('world', min, max, {
            BY: 'SCORE',
          });
          if (res.length) await this.client.hmGet('character', res);
          const end = new Date().getTime();
          totalTime += end - start;
          num += res.length;
          // console.log(end - start, final);
        })
      );
    }
    console.log(totalTime / tryNum / batchNum, num / tryNum / batchNum);

    return true;
  }
}
const convToScore = (x: number, y: number, maxDigits: number) => {
  const base = new Array(maxDigits).fill('0').join('');
  const [xbin, ybin] = [x.toString(2), y.toString(2)];
  const [xstr, ystr] = [
    base.substring(xbin.length) + xbin,
    base.substring(ybin.length) + ybin,
  ];
  return new Array(maxDigits)
    .fill(0)
    .map((_, idx) => xstr[idx] + ystr[idx])
    .join('');
};

//   await client.set("key", "value");
//   const value = await client.get("key");

export const updateCharacter = async (characterData: CharacterData) => {};

const run = async () => {
  const db = new Rtdb();
  await db.init();
  await db.test();
};
run();
