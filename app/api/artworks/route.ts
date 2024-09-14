import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      "https://api.artic.edu/api/v1/artworks?page=1"
    );
    return NextResponse.json(response.data.data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.error();
  }
}
