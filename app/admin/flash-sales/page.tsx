"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FlashSaleForm from "@/components/admin/FlashSaleForm";
import FlashSaleTime from "@/components/admin/FlashSaleTime";

interface FlashSale {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  discount: number;
  images: string[];
  imageUrl: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  active: boolean;
  order: number;
  reviewCount: number;
  rating: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function FlashSalesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchFlashSales();
  }, [session, status, router]);

  const fetchFlashSales = async () => {
    try {
      const response = await fetch("/api/admin/flash-sales");
      const data = await response.json();
      setFlashSales(data);
    } catch (error) {
      console.error("Error fetching flash sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flash sale?")) return;

    try {
      const response = await fetch(`/api/admin/flash-sales/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchFlashSales();
      }
    } catch (error) {
      console.error("Error deleting flash sale:", error);
    }
  };

  const handleEdit = (flashSale: FlashSale) => {
    setEditingFlashSale(flashSale);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingFlashSale(null);
  };

  const handleTimeFormClose = () => {
    setShowTimeForm(false);
  };

  const handleFormSuccess = () => {
    fetchFlashSales();
    handleFormClose();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/admin")}
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Flash Sales Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user?.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Manage Flash Sales</h2>
            <div>
              <button
                onClick={() => setShowTimeForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 mr-4 rounded-md hover:bg-indigo-700"
              >
                Add Flash Sale Time
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add New Flash Sale
              </button>
            </div>
          </div>
          {showTimeForm && (
            <div className="mb-8">
              <FlashSaleTime
                onCancel={handleTimeFormClose}
              />
            </div>
          )}
          {showForm && (
            <div className="mb-8">
              <FlashSaleForm
                flashSale={editingFlashSale}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {flashSales.length === 0 ?
                <li className="p-6 text-center text-gray-500">
                  No flash sales found. Create your first flash sale!
                </li>
                : flashSales.map((flashSale) => (
                  <li key={flashSale._id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={flashSale.imageUrl}
                            alt={flashSale.name}
                            width={64}
                            height={64}
                            className="object-cover rounded"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {flashSale.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${flashSale.price} (was ${flashSale.originalPrice}) | {flashSale.discount}% OFF
                            </p>
                            <p className="text-xs text-gray-400">
                              Order: {flashSale.order} | Active: {flashSale.active ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(flashSale)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(flashSale._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
