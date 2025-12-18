import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./app/(root)/auth";

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Ignorar arquivos estáticos e internos do Next
    const isStaticFile =
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|map)$/);

    if (isStaticFile) {
        return NextResponse.next();
    }

    const isPublicPath = pathname.startsWith('/auth')
    const isAuthenticate = await isAuthenticated()

    if (!isAuthenticate && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/entrar', req.url));
    }

    if(pathname === "/")
        return NextResponse.redirect(new URL('/comissao', req.url));

 
    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};