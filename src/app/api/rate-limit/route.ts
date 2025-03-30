// pages/api/submit-image.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const LIMIT = 3;

export async function GET() {
  try {
    // Get the client's IP address. We try the x-forwarded-for header first,
    // then fall back to req.ip.
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for");

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to retrieve limits for user" },
        { status: 400 }
      );
    }

    // Check the current usage count for this IP in Supabase
    const { data: usageData, error: usageError } = await supabase
      .from("limit")
      .select("count")
      .eq("ip", ip)
      .maybeSingle();

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    const usageCount = usageData ? usageData.count : 0;
    return NextResponse.json(usageCount < LIMIT, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON request body
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: "Empty JSON body" }, { status: 400 });
    }

    // Get the client's IP address. We try the x-forwarded-for header first,
    // then fall back to req.ip.
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for");

    console.log(ip);

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to retrieve limits for user" },
        { status: 400 }
      );
    }

    // Check the current usage count for this IP in Supabase
    const { data: usageData, error: usageError } = await supabase
      .from("limit")
      .select("count")
      .eq("ip", ip)
      .maybeSingle();

    if (usageError) {
      return NextResponse.json({ error: usageError.message }, { status: 500 });
    }

    let usageCount = usageData ? usageData.count : 0;

    // Update the usage count in Supabase:
    usageCount += 1;

    // If the IP already exists, increment the count; otherwise, insert a new record.
    if (usageData) {
      const { error: updateError } = await supabase
        .from("limit")
        .update({ count: usageCount })
        .eq("ip", ip);
      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabase
        .from("limit")
        .insert([{ ip, count: 1 }]);
      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}
