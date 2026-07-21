import mongoose, { Schema, Model } from 'mongoose';
import { IFlashSale } from '@/types/FlashSale';

const FlashSaleSchema = new Schema<IFlashSale>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
    },
    images: {
      type: [String],
      required: [true, 'Images are required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    colors: {
      type: [{
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }],
      required: [true, 'Colors are required'],
    },
    sizes: {
      type: [String],
      required: [true, 'Sizes are required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
    },
  },
  { timestamps: true }
);

const FlashSale: Model<IFlashSale> =
  mongoose.models.FlashSale || mongoose.model<IFlashSale>('FlashSale', FlashSaleSchema);

export default FlashSale;
