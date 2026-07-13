import { useState } from "react";

interface FlashSaleTimeProps {
    onCancel: () => void;
    onSuccess?: () => void;
}

const FlashSaleTime = ({ onCancel, onSuccess }: FlashSaleTimeProps) => {
    const [formData, setFormData] = useState({
        startTime: "",
        endTime: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.startTime || !formData.endTime) {
            setError("Both start and end time are required");
            return;
        }

        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            setError("End time must be after start time");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/flash-sale-time", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to save flash sale time");
            }

            setFormData({ startTime: "", endTime: "" });
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 mb-6 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        End Time
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex space-x-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Submit"}
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
    )
}

export default FlashSaleTime