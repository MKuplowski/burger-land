import { endpoints } from "@/shared/endpoints";
import { ProductCategory } from "@/shared/enums";
import { createMockCart, mockBestsellers, mockCartStore, mockProducts, mockTickets } from "@/shared/mocks";
import { getTestSelector } from "@/shared/test-utils";

describe("Plan Your Day Flow", () => {
  let cartId: string;

  beforeEach(() => {
    cartId = `test-cart-${Date.now()}`;
    mockCartStore.clearStore();

    cy.clearCookies();
    cy.setCookie("cartId", cartId);

    // Prepare mocks for API
    cy.stub(window, "fetch").callsFake((url, options) => {
      const method = options?.method ?? "GET";

      if (method === "GET") {
        // Fetching products
        if (url.includes(endpoints.products.getAll.path)) {
          const searchParams = new URL(url).searchParams;
          const category = searchParams.get("category");

          let products = mockProducts;
          if (category === ProductCategory.ADMISSION) {
            products = mockTickets;
          } else if (category === ProductCategory.SERVICE) {
            products = mockBestsellers;
          }

          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: products, total: products.length }),
          });
        }
        // Fetching the cart
        if (url.includes(endpoints.cart.get.path.replace(":cartId", cartId))) {
          const cart = mockCartStore.getCart(cartId) || createMockCart(cartId);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: cart }),
          });
        }
      }

      if (method === "POST") {
        // Adding an item to the cart
        if (url.includes(endpoints.cart.addItem.path.replace(":cartId", cartId))) {
          const body = JSON.parse(options?.body as string);
          const item = mockProducts.find(t => t.id === body.ticketId);

          if (!item) {
            return Promise.reject(new Error("Item not found"));
          }

          const cartItem = {
            id: crypto.randomUUID(),
            ticketId: body.ticketId,
            quantity: body.quantity,
            date: body.date,
            ticket: item,
            createdAt: new Date().toISOString(),
          };

          mockCartStore.addItemToCart(cartId, cartItem);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: { success: true } }),
          });
        }
      }

      return Promise.reject(new Error(`Unhandled fetch request: ${method} ${url}`));
    });

    cy.visit("/en");
  });

  afterEach(() => {
    mockCartStore.clearStore();
  });

  const addItemToCart = (itemName: string) => {
    cy.contains(itemName)
      .closest(getTestSelector("PRODUCT_CARD"))
      .find(getTestSelector("ADD_TO_CART_BUTTON"))
      .click();

    cy.get(getTestSelector("ADD_TO_CART_MODAL")).within(() => {
      cy.get(getTestSelector("ADD_TO_CART_MODAL_BUTTON")).click();
    });
    cy.get(getTestSelector("ADD_TO_CART_MODAL")).should("not.exist");
  };

  // TODO: in the next stage of development, add more main flow cases and another tests for edge cases
  it("should allow adding tickets and services to the cart", () => {

    if (!mockTickets[0] || !mockTickets[1] || !mockBestsellers[0]) {
      throw new Error("Missing required test data");
    }

    // 1. Add adult ticket
    addItemToCart(mockTickets[0].name);

    // 2. Add child ticket
    addItemToCart(mockTickets[1].name);

    // 3. Add Fast Pass service
    addItemToCart(mockBestsellers[0].name);

    // 4. Check cart contents
    cy.get(getTestSelector("GO_TO_CART_BUTTON")).click();
    cy.url().should("include", "/cart");

    // Verify items in the cart
    cy.get(getTestSelector("CART_ITEMS"))
      .should("contain", mockTickets[0].name)
      .and("contain", mockTickets[1].name)
      .and("contain", mockBestsellers[0].name);

    // Calculate expected total
    const expectedTotal = mockTickets[0].price + mockTickets[1].price + mockBestsellers[0].price;

    // Verify total price
    cy.get(getTestSelector("TOTAL_PRICE_VALUE"))
      .invoke("text")
      .then((text) => {
        const price = parseFloat(text);
        expect(price).to.equal(expectedTotal);
      });
  });
});