"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
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
              <h1 className="text-xl font-semibold text-gray-900">
                E-Commerce Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user?.name}
              </span>
              <button
                onClick={() => router.push("/admin/login")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Admin Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/admin/banners"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Banner Management
                </h3>
                <p className="text-gray-600">
                  Manage homepage banners and promotions
                </p>
              </Link>

              <Link
                href="/admin/flash-sales"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Flash Sales
                </h3>
                <p className="text-gray-600">
                  Manage flash sale products and discounts
                </p>
              </Link>

              <div className="bg-white p-6 rounded-lg shadow opacity-50">
                <div className="text-3xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Products
                </h3>
                <p className="text-gray-600">
                  Manage products and inventory (Coming soon)
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow opacity-50">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Users
                </h3>
                <p className="text-gray-600">
                  Manage user accounts (Coming soon)
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow opacity-50">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600">
                  View sales and traffic analytics (Coming soon)
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow opacity-50">
                <div className="text-3xl mb-4">⚙️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Settings
                </h3>
                <p className="text-gray-600">
                  Configure store settings (Coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
