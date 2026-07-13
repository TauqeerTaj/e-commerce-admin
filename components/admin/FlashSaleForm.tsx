"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import { useState } from "react";

interface FlashSale {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discount: number;
  order: number;
  active: boolean;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

function FlashSaleForm({
  flashSale,
  onSuccess,
  onCancel,
}: {
  flashSale: FlashSale | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: flashSale?.name || "",
    imageUrl: flashSale?.imageUrl || "",
    price: flashSale?.price || 0,
    originalPrice: flashSale?.originalPrice || 0,
    discount: flashSale?.discount || 0,
    order: flashSale?.order || 0,
    active: flashSale?.active ?? true,
    startTime: flashSale?.startTime || "",
    endTime: flashSale?.endTime || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = flashSale ? `/api/admin/flash-sales/${flashSale._id}` : "/api/admin/flash-sales";
      const method = flashSale ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError("Failed to save flash sale");
      }
    } catch {
      setError("Failed to save flash sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {flashSale ? "Edit Flash Sale" : "Add New Flash Sale"}
      </h3>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <ImageUpload
          onImageUpload={(imageUrl) => setFormData({ ...formData, imageUrl })}
          currentImage={formData.imageUrl}
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sale Price
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Original Price
            </label>
            <input
              type="number"
              required
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              required
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : flashSale ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlashSaleForm;
