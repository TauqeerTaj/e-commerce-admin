"use client";

import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import { useState } from "react";

interface FlashSale {
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
    images: flashSale?.images || [],
    price: flashSale?.price || 0,
    originalPrice: flashSale?.originalPrice || 0,
    discount: flashSale?.discount || 0,
    order: flashSale?.order || 0,
    active: flashSale?.active ?? true,
    description: flashSale?.description || "",
    colors: flashSale?.colors || [],
    sizes: flashSale?.sizes || [],
    category: flashSale?.category || "",
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select a category</option>
            <option value="Electronics">Phones</option>
            <option value="Clothing">Computers</option>
            <option value="Home & Garden">Smart Watches</option>
            <option value="Sports">Camera</option>
            <option value="Books">HeadPhones</option>
            <option value="Toys">Gaming</option>
          </select>
        </div>

        <ImageUpload
          onImageUpload={(imageUrl) => setFormData({ ...formData, imageUrl })}
          currentImage={formData.imageUrl}
        />

        <MultiImageUpload
          onImagesUpload={(images) => setFormData({ ...formData, images })}
          currentImages={formData.images}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Colors
          </label>
          <div className="mt-2 space-y-2">
            {formData.colors.map((color, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => {
                    const newColors = [...formData.colors];
                    newColors[idx] = { ...newColors[idx], name: e.target.value };
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="flex-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Color name"
                />
                <input
                  type="text"
                  value={color.hex}
                  onChange={(e) => {
                    const newColors = [...formData.colors];
                    newColors[idx] = { ...newColors[idx], hex: e.target.value };
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="w-24 block border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#Hex"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newColors = formData.colors.filter((_, i) => i !== idx);
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, colors: [...formData.colors, { name: '', hex: '' }] })}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add Color
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sizes (comma separated)
          </label>
          <input
            type="text"
            value={formData.sizes.join(", ")}
            onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(",").map(s => s.trim()) })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="S, M, L, XL"
          />
        </div>

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
