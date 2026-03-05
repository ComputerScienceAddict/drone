"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#eaeded]">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">
          Add some items from our store to get started.
        </p>
        <Link
          href="/product/1"
          className="mt-6 inline-block rounded-lg bg-[#ff9900] px-6 py-3 font-semibold text-[#131921] transition hover:bg-[#e88b00]"
        >
          Browse Products
        </Link>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#eaeded]">
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <div className="mt-8 space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="relative h-32 w-full shrink-0 sm:h-24 sm:w-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-lg font-bold text-[#b12704]">
                ${item.price.toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Qty:</label>
                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-sm text-[#0066c0] hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between text-xl font-bold">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-lg bg-[#ff9900] py-4 text-center font-semibold text-[#131921] transition hover:bg-[#e88b00] sm:w-auto sm:px-12"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
    </div>
  );
}
