import { Button } from "@/components/Button";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
      <html lang="en">
        <body className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-16 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Page Not Found</h1>
        <Link href="/"><Button>Go to Home</Button></Link>
        </body>
      </html>
  );
}