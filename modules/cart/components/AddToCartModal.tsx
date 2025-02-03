"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { useCart } from "@/modules/cart/hooks/useCart";
import { TEST_IDS } from "@/shared/test-ids";
import { Product } from "@/shared/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddToCartModalProps {
  item: Product;
  onClose: () => void;
}

export function AddToCartModal({ item, onClose }: AddToCartModalProps) {
  const t = useTranslations();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [quantity, setQuantity] = useState(1);
  const { cartId, addToCart } = useCart();
  const [dateFieldTouched, setDateFieldTouched] = useState(false);
  const [quantityFieldTouched, setQuantityFieldTouched] = useState(false);

  // TODO: in real app we could use react-hook-form with zod resolver for validation
  const errors = {
    date: !selectedDate && dateFieldTouched ? t("validation.dateRequired") : "",
    quantity:
      !quantity && quantityFieldTouched ? t("validation.quantityRequired") : "",
  };

  const handleAddToCart = () => {
    addToCart.mutate(
      {
        ticketId: item.id,
        quantity,
        date: selectedDate!.toISOString(),
      },
      {
        onSuccess: onClose,
        onError: (error) => {
          console.error(t("errors.addToCartError"), error);
        },
      }
    );
  };

  const handleOnChangeDate = (date: Date | null) => {
    setSelectedDate(date);
    setDateFieldTouched(true);
  };

  const handleOnChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : parseInt(e.target.value);
    setQuantity(isNaN(value) ? 0 : value);
    setQuantityFieldTouched(true);
  };

  return (
    <Modal onClose={onClose} testId={TEST_IDS.ADD_TO_CART_MODAL}>
      <Card
        title={item.name}
        description={item.description}
        footer={
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={addToCart.isPending}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={
                addToCart.isPending || !cartId || !selectedDate || !quantity
              }
              data-testid={TEST_IDS.ADD_TO_CART_MODAL_BUTTON}
            >
              {addToCart.isPending ? t("actions.adding") : t("actions.confirm")}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <Input
            label={t("form.selectDate")}
            id="date"
            error={errors.date}
            customInput={
              <DatePicker
                selected={selectedDate}
                onChange={handleOnChangeDate}
                className="w-full"
                data-testid={TEST_IDS.DATEPICKER}
              />
            }
          />

          <Input
            label={t("form.quantity")}
            id="quantity"
            type="number"
            min="1"
            error={errors.quantity}
            value={quantity}
            onChange={handleOnChangeQuantity}
            data-testid={TEST_IDS.QUANTITY_INPUT}
          />
        </div>
      </Card>
    </Modal>
  );
}
