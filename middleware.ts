import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import NextAuth from 'next-auth';
// import { Ratelimit } from '@upstash/ratelimit';
// import { kv } from '@vercel/kv';
import { authConfig } from './auth.config';

// export default NextAuth(authConfig).auth;
//
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };
//
//
// const ratelimit = new Ratelimit({
//   redis: kv,
//   // 5 requests from the same IP in 10 seconds
//   limiter: Ratelimit.slidingWindow(5, '10 s'),
// });
//
// // Define which routes you want to rate limit
// export const rateLimitingCfg = {
//   matcher: '/',
// };
//
// export async function rateLimiter(request: NextRequest) {
//   // You could alternatively limit based on user ID or similar
//   const ip = request.ip ?? '127.0.0.1';
//   const { success, pending, limit, reset, remaining } = await ratelimit.limit(
//     ip
//   );
//   return success
//     ? NextResponse.next()
//     : NextResponse.redirect(new URL('/blocked', request.url));
// }

const rateLimiter = new RateLimiterMemory({
  points: 1, // Number of points
  duration: 10, // Per second
});
export async function middleware(request: NextRequest) {
  try {
    // Consume a point for each request
    await rateLimiter.consume(request.ip);

    // If successful, proceed with the request
    return NextResponse.next();
  } catch (rateLimiterRes) {
    // If rate limit is exceeded, send a 429 response
    return new NextResponse('Too many requests', { status: 429 });
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
