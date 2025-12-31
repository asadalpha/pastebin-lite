import { NextRequest, NextResponse } from "next/server";
import { PasteService } from "@/lib/paste.service";
import { createPasteSchema } from "@/lib/validators";
import { ValidationError } from "@/lib/errors";
import { ZodError } from "zod";

// POST - REQUEST /api/pastes - [Creating a new paste-content]
//
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validatedData = createPasteSchema.parse(body);

    // Create paste using service
    const result = await PasteService.createPaste(
      validatedData,
      request.headers
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating paste:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    // Handle custom validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
