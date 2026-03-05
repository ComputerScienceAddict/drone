import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  const product = PRODUCTS[0];

  return (
    <main className="min-h-screen bg-[#eaeded]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            Today&apos;s Deal
          </h1>
          <Link
            href={`/product/${product.id}`}
            className="group block overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-64 w-full sm:h-80 sm:w-80 shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 320px"
                  priority
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#0066c0]">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
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
                    {product.rating} ({product.reviews.toLocaleString()})
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-gray-600">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#b12704]">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-[#ff9900] px-4 py-1 text-sm font-semibold text-[#131921]">
                    Add to Cart
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
    </main>
  );
}
