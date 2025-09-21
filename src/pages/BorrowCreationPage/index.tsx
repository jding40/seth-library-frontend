import { useState } from "react";
import borrowApi from "../../services/borrowApi";
import { type IBorrowRecord } from "../../types";
import axios from "axios";
import {type Location, useLocation} from "react-router-dom";

export default function BorrowCreationPage() {

    const location:Location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const defaultIsbn:string = queryParams.get("isbn") || "";
    const [formData, setFormData] = useState<IBorrowRecord>({
        ISBN: defaultIsbn,
        totalQty: 1,
        outstandingQty: 1,
        borrowerName: "",
        borrowDate: new Date(),
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "totalQty"
                    ? parseInt(value, 10) || 0
                    : name === "borrowDate"
                        ? new Date(value)
                        : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await borrowApi.create(formData);
            setMessage(`✅ Borrow record created for ${res.data.borrowerName}`);
            setFormData({
                ISBN: "",
                totalQty: 1,
                outstandingQty: 1,
                borrowerName: "",
                borrowDate: new Date(),
                notes: "",
            });
        } catch (error: Error | unknown) {
            if (axios.isAxiosError(error)) {
                console.error("❌ request failed with status:", error.response?.status);
                console.error("❌ response data:", error.response?.data);
                setMessage(`❌ ${error.response?.data?.message ?? error.message}`);
            }
            else {setMessage(`❌ Failed to save, ${(error as Error).message}...`);}
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow rounded p-6">
            <h2 className="text-xl font-bold mb-4">Create Borrow Record</h2>
            {message && (
                <div className="mb-4 text-sm">
                    {message.startsWith("✅") ? (
                        <p className="text-green-600">{message}</p>
                    ) : (
                        <p className="text-red-600">{message}</p>
                    )}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">ISBN</label>
                    <input
                        type="text"
                        name="ISBN"
                        value={formData.ISBN}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        name="totalQty"
                        value={formData.totalQty}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        min={1}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Borrower Name</label>
                    <input
                        type="text"
                        name="borrowerName"
                        value={formData.borrowerName}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Borrow Date</label>
                    <input
                        type="date"
                        name="borrowDate"
                        value={formData.borrowDate.toISOString().split("T")[0]}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded px-3 py-2"
                        rows={3}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    );
}
