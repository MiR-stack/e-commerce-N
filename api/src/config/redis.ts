import dotenv from "dotenv";

dotenv.config();

export const REDIS_HOST = process.env.REDIS_HOST || "http://localhost";
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
export const SESSION_TTL = Number(process.env.REDIS_SESSION_TTL) || 300;
