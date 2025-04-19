import { NextResponse } from 'next/server';
import validateAuth from './utils/middleware/validateAuth.tsx';

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const response = NextResponse.next();
    
    if ( // skip calls for static assets
        pathname.startsWith('/_next') || 
        pathname.startsWith('/static') || 
        pathname === '/favicon.ico' ||
        /\.(png|jpg|jpeg|gif|svg|ico|webp|ttf|woff|woff2|eot|otf)$/.test(pathname) // assets in public
    ) {
        return NextResponse.next();
    }
    
    try {
        const { isAuthenticated, message } = await validateAuth(req);
        
        if (!isAuthenticated) {
            const redirectUrl = new URL('/login', req.url);
            redirectUrl.searchParams.set('error', message);

            return NextResponse.redirect(redirectUrl);
        }

    } catch (error) {
        return NextResponse.redirect(new URL('/error', req.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!$|phones/?$|tablets/?$|login/?$|register/?$).*)',
    ],
};
  