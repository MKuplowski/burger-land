import { NextRequest, NextResponse } from "next/server";
import { endpoints } from "../../../../../../shared/endpoints";
import { CartItemParams, CommonApiResponse, ErrorResponse, SuccessResponse, UpdateCartItemPayload } from "../../../../../../shared/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: CartItemParams }
): Promise<NextResponse<CommonApiResponse<SuccessResponse> | ErrorResponse>> {
  let payload: UpdateCartItemPayload & CartItemParams;
  try {
    const body = await request.json();
    const requestData = { ...body, ...params };
    const validation = endpoints.cart.updateItem.requestSchema?.safeParse(requestData);
    if (!validation?.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }
    payload = validation.data;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const response = {
    data: {
      success: true,
    },
  };

  const responseValidation = endpoints.cart.updateItem.responseSchema.safeParse(response);
  if (!responseValidation.success) {
    console.error("Validation error:", responseValidation.error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: CartItemParams }
): Promise<NextResponse<CommonApiResponse<SuccessResponse> | ErrorResponse>> {
  const validation = endpoints.cart.removeItem.requestSchema?.safeParse(params);
  if (!validation?.success) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const response = {
    data: {
      success: true,
    },
  };

  const responseValidation = endpoints.cart.removeItem.responseSchema.safeParse(response);
  if (!responseValidation.success) {
    console.error("Validation error:", responseValidation.error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}