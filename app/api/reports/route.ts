import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lng, description } = body;

    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Latitud y longitud son requeridas" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          lat,
          lng,
          description: description || "",
        },
      ])
      .select();

    if (error) {
      console.error("Error al insertar reporte:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error inesperado en /api/reports:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
