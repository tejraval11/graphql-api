import { createClient } from 'redis';


const redisClient = createClient({
  url: 'redis://localhost:6379' 
});


redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect();  

export const setCache = async (key: string, value: any, ttl: number) => {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
};

export const getCache = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};
