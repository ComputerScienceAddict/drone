"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = PRODUCTS.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link href="/" className="text-[#ff9900] hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-[60vh] bg-[#eaeded]">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>
          <p className="mt-4 text-lg text-gray-600">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#b12704]">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="rounded-lg bg-[#ff9900] px-8 py-3 font-semibold text-[#131921] transition hover:bg-[#e88b00] disabled:opacity-60"
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                router.push("/checkout");
              }}
              className="rounded-lg border-2 border-[#ff9900] px-8 py-3 font-semibold text-[#ff9900] transition hover:bg-[#ff9900] hover:text-[#131921]"
            >
              Buy Now
            </button>
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-block text-sm text-[#0066c0] hover:underline"
          >
            View cart →
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
