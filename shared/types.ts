import { ProductCategory, ProductTag, ProductType } from "@/shared/enums";
import { z } from "zod";
import * as schemas from "./schemas";

export type CommonProperties = z.infer<typeof schemas.CommonPropertiesSchema>

export type CommonApiResponse<T> = {
  data: T
  total?: number
}

export type ErrorResponse = {
  error: string
}

// Domain types
export type Product = z.infer<typeof schemas.ProductSchema>
export type CartItem = z.infer<typeof schemas.CartItemSchema>
export type Cart = z.infer<typeof schemas.CartSchema>

// Request types
export type AddToCartPayload = z.infer<typeof schemas.AddToCartSchema>
export type UpdateCartItemPayload = z.infer<typeof schemas.UpdateCartItemSchema>
export type CartIdParams = z.infer<typeof schemas.CartIdParamsSchema>
export type CartItemParams = z.infer<typeof schemas.CartItemParamsSchema>

// Response types
export type SuccessResponse = z.infer<typeof schemas.SuccessResponseSchema>
export type CartIdResponse = z.infer<typeof schemas.CartIdResponseSchema>

// Helper type guards
export const isAdmissionProduct = (product: Product): boolean =>
  product.category === ProductCategory.ADMISSION;

export const isServiceProduct = (product: Product): boolean =>
  product.category === ProductCategory.SERVICE;

export const isBestseller = (product: Product): boolean =>
  product.tags.includes(ProductTag.BESTSELLER) || product.type === ProductType.FAST_PASS;
