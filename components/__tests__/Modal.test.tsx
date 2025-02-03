import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "../Modal";

describe("Modal", () => {
  const mockOnClose = jest.fn();
  const testId = "test-modal";
  const childrenText = "Modal content";

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("renders modal with children", () => {
    render(
      <Modal onClose={mockOnClose} testId={testId}>
        {childrenText}
      </Modal>
    );

    expect(screen.getByTestId(testId)).not.toBeNull();
    expect(screen.getByText(childrenText)).not.toBeNull();
  });

  it("calls onClose when clicking overlay", () => {
    render(
      <Modal onClose={mockOnClose} testId={testId}>
        {childrenText}
      </Modal>
    );

    const overlay = screen.getByTestId(testId).parentElement?.parentElement
      ?.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    render(
      <Modal onClose={mockOnClose} testId={testId} className={customClass}>
        {childrenText}
      </Modal>
    );

    const modalContainer = screen.getByTestId(testId).parentElement;
    expect(modalContainer?.classList.contains(customClass)).toBe(true);
  });
});
