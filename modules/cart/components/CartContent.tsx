"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Loading } from "@/components/Loading";
import { Link } from "@/i18n/routing";
import { useCart } from "@/modules/cart/hooks/useCart";
import { TEST_IDS } from "@/shared/test-ids";
import { CartItem } from "@/shared/types";
import { useTranslations } from "next-intl";

export function CartContent() {
  const t = useTranslations();
  const { cart, isCartLoading } = useCart();

  if (isCartLoading) {
    return <Loading />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("sections.cart.empty")}
          </h1>
          <div className="mt-2">
            <Button variant="secondary" asChild>
              <Link href="/">{t("actions.continueShopping")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("sections.cart.title")}
          </h1>
          <Button variant="secondary" asChild>
            <Link href="/">{t("actions.continueShopping")}</Link>
          </Button>
        </div>

        <div data-testid={TEST_IDS.CART_ITEMS} className="space-y-4">
          {cart.items.map((item: CartItem) => (
            <Card
              key={item.id}
              title={item.ticket.name}
              description={item.ticket.description}
              footer={
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-gray-500">
                    {t("form.date")}: {new Date(item.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    {t("form.quantity")}: {item.quantity}
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    ${item.ticket.price}
                  </div>
                </div>
              }
            />
          ))}
        </div>

        <Card
          className="mt-8"
          title={t("sections.cart.summary")}
          footer={
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xl font-bold text-gray-900">
                {t("sections.cart.total")}: $
                <span data-testid={TEST_IDS.TOTAL_PRICE_VALUE}>
                  {cart.total.toFixed(2)}
                </span>
              </div>
              <Button size="lg" data-testid={TEST_IDS.CHECKOUT_BUTTON} asChild>
                <Link href="/checkout">{t("actions.checkout")}</Link>
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}
