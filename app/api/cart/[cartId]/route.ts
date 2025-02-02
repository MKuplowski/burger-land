import { NextRequest, NextResponse } from "next/server";
import { endpoints } from "../../../../shared/endpoints";
import { mockCartStore } from "../../../../shared/mocks";
import { Cart, CartIdParams, CommonApiResponse, ErrorResponse } from "../../../../shared/types";

export async function GET(
  request: NextRequest,
  context: { params: CartIdParams }
): Promise<NextResponse<CommonApiResponse<Cart> | ErrorResponse>> {

  const { cartId } = await context.params;

  const cookieCartId = request.cookies.get("cartId")?.value;
  if (!cookieCartId || cookieCartId !== cartId) {
    return NextResponse.json(
      { error: "Invalid cart ID" },
      { status: 400 }
    );
  }

  const cart = mockCartStore.getCart(cartId);
  if (!cart) {
    return NextResponse.json(
      { error: "Cart not found" },
      { status: 404 }
    );
  }

  const response = {
    data: cart,
  };

  const responseValidation = endpoints.cart.get.responseSchema.safeParse(response);
  if (!responseValidation.success) {
    // TODO: create a strategy for translating errors
    console.error("Validation error:", responseValidation.error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}