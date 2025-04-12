// middleware.js (root of your project)
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
});

export async function middleware(req) {
    try {
        const sessionCookie = req.cookies.get('session_token');

        // Check if session token exists
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Validate session token in Redis
        const redisSessionValues = await redis.get(sessionCookie.value);
        if (!redisSessionValues) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // If everything is valid, proceed to the next middleware or route
        return NextResponse.next();
    } catch (error) {
        console.error("Auth error: ", error);
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

export const config = {
    matcher: ['/protected/:path*']
};
