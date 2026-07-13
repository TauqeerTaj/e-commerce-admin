// models/FlashSaleTime.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IFlashSaleTime } from '@/types/FlashSaleTime';


const FlashSaleTimeSchema = new Schema<IFlashSaleTime>(
  {
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
  },
  { timestamps: true }
);

// Prevent model overwrite errors in Next.js dev (hot reload)
const FlashSaleTime: Model<IFlashSaleTime> =
  mongoose.models.FlashSaleTime ||
  mongoose.model<IFlashSaleTime>('FlashSaleTime', FlashSaleTimeSchema);

export default FlashSaleTime;