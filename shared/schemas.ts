import { z } from "zod";
import { ProductCategory, ProductTag, ProductType } from "./enums";

// Common schemas
export const CommonPropertiesSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// Product schemas
export const ProductSchema = CommonPropertiesSchema.extend({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.nativeEnum(ProductCategory),
  type: z.nativeEnum(ProductType),
  availableDates: z.array(z.string().datetime()),
  soldCount: z.number().default(0),
  tags: z.array(z.nativeEnum(ProductTag)).default([]),
});

// Cart schemas
export const CartItemSchema = CommonPropertiesSchema.extend({
  ticketId: z.string(),
  quantity: z.number().min(1),
  date: z.string().datetime(),
  ticket: ProductSchema,
});

export const CartSchema = CommonPropertiesSchema.extend({
  items: z.array(CartItemSchema),
  total: z.number(),
});

// Request schemas
export const AddToCartSchema = z.object({
  ticketId: z.string(),
  quantity: z.number().min(1),
  date: z.string().datetime(),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().min(1),
});

// Cart request schemas
export const CartIdParamsSchema = z.object({
  cartId: z.string().min(1),
});

export const CartItemParamsSchema = CartIdParamsSchema.extend({
  itemId: z.string().min(1),
});

// Response schemas
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
});

export const CartIdResponseSchema = z.object({
  cartId: z.string(),
});