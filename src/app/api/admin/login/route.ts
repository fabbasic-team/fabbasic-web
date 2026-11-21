import { NextRequest, NextResponse } from "next/server";
import { signAdminSession } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (
      email?.trim().toLowerCase() !== expectedEmail.toLowerCase() ||
      password !== expectedPassword
    ) {
      return NextResponse.json(
        { error: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    // Issue signed session token
    const token = await signAdminSession(expectedEmail);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: { email: expectedEmail, role: "admin" },
    });

    // Set HTTP-only secure cookie
    response.cookies.set("fab_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
