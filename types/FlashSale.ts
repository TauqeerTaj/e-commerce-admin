export interface IFlashSale {
  _id: string;
  name: string;
  imageUrl: string;
  images: string[];
  price: number;
  originalPrice: number;
  discount: number;
  order: number;
  active: boolean;
  description: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
