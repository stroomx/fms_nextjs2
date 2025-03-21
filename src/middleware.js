import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig"; import { NextResponse } from 'next/server';
import AuthService from './auth.service';
import { cookies } from 'next/headers';


// Define public routes with regex for matching dynamic routes
const publicRoutes = [
    {
        path: '/auth/login',
        regex: /^\/(?:[a-z]{2}\/)?auth\/login$/, // Matches /auth/login or /[locale]/auth/login
        isRegex: true,
    },
    {
        path: '/auth/signup',
        regex: /^\/(?:[a-z]{2}\/)?auth\/signup$/, // Matches /auth/signup or /[locale]/auth/signup
        isRegex: true,
    },
    {
        path: '/auth/forgotpassword',
        regex: /^\/(?:[a-z]{2}\/)?auth\/forgotpassword$/, // Matches /auth/forgotpassword or /[locale]/auth/forgotpassword
        isRegex: true,
    },
    {
        path: '/profile/',
        regex: /^\/(?:[a-z]{2}\/)?profile$/, // Matches /profile or /[locale]/profile
        isRegex: true,
    },
    {
        path: '/profile/[franchise]',
        regex: /^\/(?:[a-z]{2}\/)?profile\/\d+$/, // Matches /profile/12345 or /[locale]/profile/12345
        isRegex: true,
    },
];

// Middleware function to handle route authentication and internationalization
export function middleware(request) {
    const path = request.nextUrl.pathname;

    // If the route is in the list of public routes, skip the authentication check
    if (isPublicRoute(path)) {
        return i18nRouter(request, i18nConfig);
    }

    // If not authenticated, redirect to the login page
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken) {
        return NextResponse.redirect(new URL(`/auth/login?redirect_url=${path}`, request.url));
    }

    // If authenticated, continue with i18n routing
    return i18nRouter(request, i18nConfig);
}

function isPublicRoute(path) {
    for (const route of publicRoutes) {
        if (route.isRegex && route.regex.test(path)) {
            // If it's a regex and matches the path, return true
            return true;
        }

        // If the path exactly matches the public route path, return true (for static paths)
        if (path === route.path) {
            return true;
        }
    }

    return false;
}

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)', // Exclude API, static files, and Next.js internal paths
};