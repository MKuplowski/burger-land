import { mockProducts } from "@/shared/mocks";
import { TEST_IDS } from "@/shared/test-ids";
import { Product } from "@/shared/types";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useCart } from "../../hooks/useCart";
import { AddToCartModal } from "../AddToCartModal";

jest.mock("../../hooks/useCart");
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("AddToCartModal", () => {
  const mockOnClose = jest.fn();
  const mockAddToCart = {
    mutate: jest.fn(),
    isPending: false,
  };
  const product = mockProducts[0] as Product;

  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({
      cartId: "test-cart-id",
      addToCart: mockAddToCart,
    });
  });

  it("renders with initial state", () => {
    render(<AddToCartModal item={product} onClose={mockOnClose} />);

    expect(screen.getByTestId(TEST_IDS.ADD_TO_CART_MODAL)).not.toBeNull();
    expect(screen.getByText(product.name)).not.toBeNull();
    expect(screen.getByText(product.description)).not.toBeNull();
    expect(screen.getByRole("textbox")).not.toBeNull();
    expect(screen.getByTestId(TEST_IDS.QUANTITY_INPUT).getAttribute("value")).toBe("1");
  });

  it("handles quantity change", () => {
    render(<AddToCartModal item={product} onClose={mockOnClose} />);

    const quantityInput = screen.getByTestId(TEST_IDS.QUANTITY_INPUT);
    fireEvent.change(quantityInput, { target: { value: "2" } });

    expect(quantityInput.getAttribute("value")).toBe("2");
  });

  it("handles add to cart submission", async () => {
    render(<AddToCartModal item={product} onClose={mockOnClose} />);

    const addButton = screen.getByTestId(TEST_IDS.ADD_TO_CART_MODAL_BUTTON);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockAddToCart.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          ticketId: product.id,
          quantity: 1,
        }),
        expect.any(Object)
      );
    });
  });

  it("disables add button when cart is pending", () => {
    (useCart as jest.Mock).mockReturnValue({
      cartId: "test-cart-id",
      addToCart: { ...mockAddToCart, isPending: true },
    });

    render(<AddToCartModal item={product} onClose={mockOnClose} />);

    const addButton = screen.getByTestId(TEST_IDS.ADD_TO_CART_MODAL_BUTTON);
    expect(addButton.hasAttribute("disabled")).toBe(true);
  });

  it("closes modal on successful add to cart", async () => {
    mockAddToCart.mutate.mockImplementation((_, options) => {
      options.onSuccess();
    });

    render(<AddToCartModal item={product} onClose={mockOnClose} />);

    const addButton = screen.getByTestId(TEST_IDS.ADD_TO_CART_MODAL_BUTTON);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});