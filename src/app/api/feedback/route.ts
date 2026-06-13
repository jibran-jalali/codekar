import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      enrollment_id, 
      student_name, 
      student_email, 
      rating, 
      comment,
      experience_level,
      built_website,
      instruction_rating,
      ai_tools_rating,
      pace_rating,
      hands_on_rating,
      liked_most,
      to_improve,
      recommend,
      testimonial_permission
    } = body;

    // Handle empty enrollment_id for UUID field
    const validEnrollmentId = enrollment_id && enrollment_id.trim() !== "" ? enrollment_id : null;

    const { error } = await supabase.from("feedback").insert([
      {
        enrollment_id: validEnrollmentId,
        student_name,
        student_email,
        rating,
        comment,
        experience_level,
        built_website,
        instruction_rating,
        ai_tools_rating,
        pace_rating,
        hands_on_rating,
        liked_most,
        to_improve,
        recommend,
        testimonial_permission
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
