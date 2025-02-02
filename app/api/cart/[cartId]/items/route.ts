import { NextRequest, NextResponse } from "next/server";
import { endpoints } from "../../../../../shared/endpoints";
import { createMockCart, mockCartStore, mockProducts } from "../../../../../shared/mocks";
import { AddToCartPayload, CartIdParams, CommonApiResponse, ErrorResponse, Product, SuccessResponse } from "../../../../../shared/types";

export async function POST(
  request: NextRequest,
  context: { params: CartIdParams }
): Promise<NextResponse<CommonApiResponse<SuccessResponse> | ErrorResponse>> {
  const { cartId } = await context.params;

  const cookieCartId = request.cookies.get("cartId")?.value;
  if (!cookieCartId || cookieCartId !== cartId) {
    return NextResponse.json(
      { error: "Invalid cart ID" },
      { status: 400 }
    );
  }

  let payload: AddToCartPayload & CartIdParams;
  try {
    const body = await request.json();
    const requestData = { ...body, cartId };
    const validation = endpoints.cart.addItem.requestSchema?.safeParse(requestData);
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

  const item = mockProducts.find((p: Product) => p.id === payload.ticketId);

  if (!item) {
    return NextResponse.json(
      { error: "Item not found" },
      { status: 404 }
    );
  }

  let cart = mockCartStore.getCart(payload.cartId);
  if (!cart) {
    cart = createMockCart(payload.cartId);
  }

  const updatedCart = mockCartStore.addItemToCart(payload.cartId, {
    id: crypto.randomUUID(),
    ticketId: payload.ticketId,
    quantity: payload.quantity,
    date: payload.date,
    ticket: item,
    createdAt: new Date().toISOString(),
  });

  if (!updatedCart) {
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }

  const response = {
    data: {
      success: true,
    },
  };

  const responseValidation = endpoints.cart.addItem.responseSchema.safeParse(response);
  if (!responseValidation.success) {
    console.error("Validation error:", responseValidation.error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(response);
}