import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase/client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseClient();
    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          message: "You're already on the list — we'll be in touch.",
        });
      }

      console.error("Waitlist insert error:", error);
      return NextResponse.json(
        { error: "Could not save your email. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "You're on the list — we'll be in touch.",
    });
  } catch (error) {
    console.error("Waitlist route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
