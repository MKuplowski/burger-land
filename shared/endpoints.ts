import { CommonApiResponse } from "@/shared/types";
import { z } from "zod";
import * as schemas from "./schemas";

// TODO: consider using ts-rest due to complete documentation, path should be type safe
export const endpoints = {
  products: {
    getAll: createEndpoint({
      method: "GET",
      path: "/api/products",
      responseSchema: z.array(schemas.ProductSchema),
    }),
  },
  cart: {
    get: createEndpoint({
      method: "GET",
      path: "/api/cart/:cartId",
      responseSchema: schemas.CartSchema,
      requestSchema: schemas.CartIdParamsSchema,
    }),
    create: createEndpoint({
      method: "POST",
      path: "/api/cart",
      responseSchema: schemas.CartIdResponseSchema,
    }),
    addItem: createEndpoint({
      method: "POST",
      path: "/api/cart/:cartId/items",
      responseSchema: schemas.SuccessResponseSchema,
      requestSchema: schemas.AddToCartSchema.extend({
        cartId: z.string().min(1),
      }),
    }),
    updateItem: createEndpoint({
      method: "PUT",
      path: "/api/cart/:cartId/items/:itemId",
      responseSchema: schemas.SuccessResponseSchema,
      requestSchema: schemas.UpdateCartItemSchema.extend({
        cartId: z.string().min(1),
        itemId: z.string().min(1),
      }),
    }),
    removeItem: createEndpoint({
      method: "DELETE",
      path: "/api/cart/:cartId/items/:itemId",
      responseSchema: schemas.SuccessResponseSchema,
      requestSchema: schemas.CartItemParamsSchema,
    }),
  },
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export type EndpointDefinition<TResponse, TRequest = void> = {
  method: HttpMethod;
  path: string;
  responseSchema: z.ZodType<CommonApiResponse<TResponse>>;
  requestSchema?: z.ZodType<TRequest>;
};

export function createEndpoint<TResponse, TRequest = void>(config: {
  method: HttpMethod
  path: string
  responseSchema: z.ZodType<TResponse>
  requestSchema?: z.ZodType<TRequest>
}): EndpointDefinition<TResponse, TRequest> {
  return {
    method: config.method,
    path: config.path,
    requestSchema: config.requestSchema,
    responseSchema: z.object({
      data: config.responseSchema,
      total: z.number().optional(),
    }) as z.ZodType<CommonApiResponse<TResponse>>,
  };
}
