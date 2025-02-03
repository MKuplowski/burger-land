"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { TEST_IDS } from "@/shared/test-ids";
import { Product } from "@/shared/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AddToCartModal } from "./AddToCartModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(s => !s);

  return (
    <div data-testid={TEST_IDS.PRODUCT_CARD}>
      <Card
        title={product.name}
        description={product.description}
        footer={
          <>
            <span className="text-lg font-medium text-gray-900">${product.price}</span>
            <Button
              onClick={toggleModal}
              data-testid={TEST_IDS.ADD_TO_CART_BUTTON}
            >
              {t("actions.addToCart")}
            </Button>
          </>
        }
      >
        {/* TODO: not the best way to render modal, but let's keep it simple for now */}
        {isModalOpen && (
          <AddToCartModal
            item={product}
            onClose={toggleModal}
          />
        )}
      </Card>
    </div>
  );
}