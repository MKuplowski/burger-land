import { ProductCategory, ProductTag, ProductType } from "./enums";
import { Cart, CartItem, Product } from "./types";

class MockCartStore {
  private carts: Map<string, Cart> = new Map();

  calculateCartTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.ticket.price * item.quantity), 0);
  }

  createCart(cartId: string): Cart {
    const cart: Cart = {
      id: cartId,
      items: [],
      total: 0,
      createdAt: new Date().toISOString(),
    };
    this.carts.set(cartId, cart);
    return cart;
  }

  getCart(cartId: string): Cart | undefined {
    return this.carts.get(cartId);
  }

  addItemToCart(cartId: string, item: CartItem): Cart | undefined {
    const cart = this.carts.get(cartId);
    if (!cart) return undefined;

    cart.items.push(item);
    cart.total = this.calculateCartTotal(cart.items);
    return cart;
  }

  clearStore() {
    this.carts.clear();
  }
}

export const mockCartStore = new MockCartStore();

export const mockProducts: Product[] = [
  // Admission products
  {
    id: "1",
    name: "Adult Ticket",
    description: "Entry ticket for adults",
    price: 50,
    category: ProductCategory.ADMISSION,
    type: ProductType.ADULT,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    soldCount: 0,
    tags: [],
  },
  {
    id: "2",
    name: "Child Ticket",
    description: "Entry ticket for children",
    price: 25,
    category: ProductCategory.ADMISSION,
    type: ProductType.CHILD,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    soldCount: 0,
    tags: [],
  },
  {
    id: "3",
    name: "Family Ticket",
    description: "Entry ticket for a family of 2 adults and 2 children",
    price: 120,
    category: ProductCategory.ADMISSION,
    type: ProductType.FAMILY,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    soldCount: 0,
    tags: [],
  },
  // Service products (bestsellers)
  {
    id: "4",
    name: "Fast Pass - Quick Queue",
    description: "Add-on allowing access to the quick queue for all attractions",
    price: 99,
    category: ProductCategory.SERVICE,
    type: ProductType.FAST_PASS,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    soldCount: 250,
    tags: [ProductTag.BESTSELLER],
  },
  {
    id: "5",
    name: "Premium Restaurant Voucher",
    description: "Voucher worth 50€ to be used in a Michelin-starred restaurant in the park",
    price: 45,
    category: ProductCategory.SERVICE,
    type: ProductType.VOUCHER,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    soldCount: 180,
    tags: [ProductTag.BESTSELLER],
  },
  {
    id: "6",
    name: "Gastronomy Package",
    description: "Voucher worth 50€ to be used in food points in the park",
    price: 40,
    category: ProductCategory.SERVICE,
    type: ProductType.VOUCHER,
    availableDates: [
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
    createdAt: new Date().toISOString(),
    soldCount: 320,
    tags: [ProductTag.BESTSELLER],
  },
];

export const mockTickets = mockProducts.filter(p => p.category === ProductCategory.ADMISSION);
export const mockBestsellers = mockProducts.filter(p => p.category === ProductCategory.SERVICE);

export const createMockCart = (cartId: string): Cart => {
  return mockCartStore.createCart(cartId);
};