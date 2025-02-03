import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/modules/cart/components/ProductCard";
import { mockProducts } from "@/shared/mocks";
import { TEST_IDS } from "@/shared/test-ids";
import { isAdmissionProduct, isBestseller } from "@/shared/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Burger Land",
};

// TODO: we should have common components for layout
// TODO: skeleton loading for better UX
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-16 bg-gray-50">
      <Suspense fallback={<Loading />}>
        <HomeContent />
      </Suspense>

      <Suspense fallback={null}>
        <CartButton />
      </Suspense>
    </main>
  );
}

async function CartButton() {
  const t = await getTranslations();

  return (
    <Link
      href="/cart"
      className="fixed bottom-8 right-8 animate-bounce-slow"
      data-testid={TEST_IDS.GO_TO_CART_BUTTON}
    >
      <Button
        variant="primary"
        size="lg"
        className="shadow-lg hover:shadow-xl transition-shadow"
      >
        {t("sections.cart.view")}
      </Button>
    </Link>
  );
}

// TODO: in real app we fetch products from the server and in this case SSR would be beneficial for SEO
async function HomeContent() {
  const t = await getTranslations();

  const AdmissionSection = () => (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        {t("sections.tickets.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProducts.filter(isAdmissionProduct).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  const BestsellersSection = () => (
    <section className="w-full" data-testid={TEST_IDS.BESTSELLERS}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        {t("sections.bestsellers.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProducts.filter(isBestseller).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-16">{t("title")}</h1>

      <div className="flex flex-col gap-6">
        <AdmissionSection />
        <BestsellersSection />
      </div>
    </>
  );
}
