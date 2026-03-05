"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? 0,
        });
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location access denied. Please enter coordinates manually."
            : "Unable to retrieve your location. Please enter coordinates manually."
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const finalCoordinates =
    coordinates ??
    (manualLat && manualLng
      ? {
          latitude: parseFloat(manualLat),
          longitude: parseFloat(manualLng),
          accuracy: 0,
        }
      : null);

  const isValidManual =
    manualLat &&
    manualLng &&
    !isNaN(parseFloat(manualLat)) &&
    !isNaN(parseFloat(manualLng));

  const canCheckout = cart.length > 0 && (coordinates || isValidManual);

  const handlePlaceOrder = async () => {
    if (!canCheckout || !finalCoordinates) return;

    setSaving(true);
    setSaveError(null);

    try {
      const { error } = await supabase.from("orders").insert({
        items: cart,
        total: totalPrice,
        latitude: finalCoordinates.latitude,
        longitude: finalCoordinates.longitude,
        accuracy: finalCoordinates.accuracy,
      });

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }

      setOrderComplete(true);
      clearCart();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save order");
      setSaving(false);
      return;
    } finally {
      setSaving(false);
    }
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[60vh] bg-[#eaeded]">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <Link
          href="/product/1"
          className="mt-6 inline-block text-[#0066c0] hover:underline"
        >
          Add items to checkout
        </Link>
      </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-[60vh] bg-[#eaeded]">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-xl bg-green-50 p-8">
          <h2 className="text-2xl font-bold text-green-800">
            Order placed successfully!
          </h2>
          <p className="mt-2 text-green-700">
            Your order and delivery coordinates have been saved. We&apos;ll deliver to your location. Thank you for shopping with us.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#ff9900] px-6 py-3 font-semibold text-[#131921] transition hover:bg-[#e88b00]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-[#eaeded]">
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Delivery Location (Coordinates)
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            We use your precise coordinates for accurate delivery.
          </p>

          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Getting your location...
            </div>
          ) : coordinates ? (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="font-medium text-green-800">
                ✓ Location captured successfully
              </p>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                <p>
                  <strong>Latitude:</strong>{" "}
                  {coordinates.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Longitude:</strong>{" "}
                  {coordinates.longitude.toFixed(6)}
                </p>
                {coordinates.accuracy > 0 && (
                  <p>
                    <strong>Accuracy:</strong> ±{Math.round(coordinates.accuracy)}m
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {error && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  {error}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter coordinates manually
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Latitude (e.g. 40.7128)"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Longitude (e.g. -74.0060)"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[#0066c0] hover:underline"
            >
              Retry getting location
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="relative h-16 w-16 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {saveError && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {saveError}
            </p>
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={!canCheckout || saving}
            className="mt-6 w-full rounded-lg bg-[#ff9900] py-4 font-semibold text-[#131921] transition hover:bg-[#e88b00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving order..." : "Place Order"}
          </button>
          {!canCheckout && (loading || (!coordinates && !isValidManual)) && (
            <p className="mt-2 text-center text-sm text-gray-500">
              {loading
                ? "Getting your location..."
                : "Allow location access or enter coordinates to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
