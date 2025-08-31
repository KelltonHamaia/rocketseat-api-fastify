import { drizzle } from 'drizzle-orm/node-postgres'

const database_url = process.env.DATABASE_URL

export const db = drizzle(database_url, {
    logger: process.env.NODE_ENV === 'development',
})
