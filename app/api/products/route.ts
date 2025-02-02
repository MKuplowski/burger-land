import { ProductCategory } from "@/shared/enums";
import { NextResponse } from "next/server";
import { endpoints } from "../../../shared/endpoints";
import { mockBestsellers, mockProducts, mockTickets } from "../../../shared/mocks";
import { CommonApiResponse, ErrorResponse, Product } from "../../../shared/types";

export async function GET(
  request: Request
): Promise<NextResponse<CommonApiResponse<Product[]> | ErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let products = mockProducts;

  if (category === ProductCategory.ADMISSION) {
    products = mockTickets;
  } else if (category === ProductCategory.SERVICE) {
    products = mockBestsellers;
  }

  const response = {
    data: products,
    total: products.length,
  };

  const validationResult = endpoints.products.getAll.responseSchema.safeParse(response);
  if (!validationResult.success) {
    console.error("Validation error:", validationResult.error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}