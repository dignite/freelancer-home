import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/index"],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(" ")[1];
      if (!authValue) throw new Error("Missing auth value");
      const decoded = atob(authValue);
      if (!decoded.includes(":"))
        throw new Error("Missing colon in decoded auth");
      const [user, pwd] = decoded.split(":");

      if (user === process.env.USER_NAME && pwd === process.env.PASSWORD) {
        return NextResponse.next();
      }
    } catch {
      // malformed Authorization header — fall through to auth challenge
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
