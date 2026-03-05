export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Storage Box Set",
    price: 34.99,
    description:
      "Sturdy cardboard storage boxes, perfect for moving, organizing, or shipping. Set includes 5 medium-sized boxes with reinforced corners. Easy to assemble and stack. Eco-friendly and recyclable.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 1523,
  },
];
