import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  
  // Check if we need to redirect to canonical domain
  const shouldRedirectToCanonical = 
    hostname.startsWith('www.') || 
    protocol !== 'https';
  
  if (shouldRedirectToCanonical) {
    // Create the canonical URL
    const canonicalHostname = hostname.replace(/^www\./, '');
    url.protocol = 'https';
    url.host = canonicalHostname;
    
    // Return 301 redirect
    return NextResponse.redirect(url.toString(), { 
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=86400',
      }
    });
  }
  
  // Add canonical link header for all responses
  const response = NextResponse.next();
  const canonicalUrl = new URL(url.pathname, `https://${hostname.replace(/^www\./, '')}`);
  
  response.headers.set(
    'Link',
    `<${canonicalUrl.toString()}>; rel="canonical"`
  );
  
  // Add Strict-Transport-Security header to enforce HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  return response;
}

// Only run middleware on the following paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};