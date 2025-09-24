import { useState, useEffect } from "react";
import { type IBorrowRecord } from "../../types";
import { useParams, useNavigate } from "react-router-dom";
import borrowApi from "../../services/borrowApi.ts";

export default function BorrowUpdate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<IBorrowRecord | null>(null);

    if (!id) throw new Error(`No borrow record found with id: ${id}`);

    // fetch borrow record from the backend database
    useEffect(() => {
        const fetchBorrow = async () => {
            setLoading(true);
            try {
                const res = await borrowApi.getById(id);
                if (res.data) setFormData(res.data);
            } catch (err) {
                setError("Failed to load borrow record.");
                console.error("Error: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBorrow();
    }, [id]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData((prev) =>
            prev
                ? {
                    ...prev,
                    [name]:
                        name === "totalQty" || name === "outstandingQty"
                            ? Number(value)
                            : value,
                }
                : prev
        );
    };

    // submit the form to update the borrow record
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData?._id) return;

        setLoading(true);
        setError(null);

        try {
            await borrowApi.update(formData);
            navigate("/borrows"); // ✅ 更新后跳转到借阅列表页 (根据你的路由改)
        } catch (err: unknown) {
            // setError(err.response?.data?.message || "Update failed");
            console.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (!formData) {
        return <p className="text-center text-red-600">No record found.</p>;
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 max-w-xl mx-auto border rounded-lg shadow"
        >
            {/* id --  hidden field*/}
            <input type="hidden" name="_id" value={formData._id} />

            {/* ISBN */}
            <div className="mb-3">
                <label className="block text-gray-700">ISBN</label>
                <input
                    type="text"
                    value={formData.ISBN}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                />
            </div>

            {/* borrower */}
            <div className="mb-3">
                <label className="block text-gray-700">Borrower Name</label>
                <input
                    type="text"
                    value={formData.borrowerName}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                />
            </div>

            {/* borrow date */}
            <div className="mb-3">
                <label className="block text-gray-700">Borrow Date</label>
                <input
                    type="date"
                    name="borrowDate"
                    value={formData.borrowDate
                        ? new Date(formData.borrowDate).toISOString().slice(0, 10)
                        : ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded "
                />
            </div>

            {/* total qty */}
            <div className="mb-3">
                <label className="block text-gray-700">Total Quantity</label>
                <input
                    type="number"
                    name="totalQty"
                    value={formData.totalQty}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* outstanding qty */}
            <div className="mb-3">
                <label className="block text-gray-700">Outstanding Quantity</label>
                <input
                    type="number"
                    name="outstandingQty"
                    value={formData.outstandingQty}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* return status */}
            {/*<div className="mb-3">*/}
            {/*    <label className="block text-gray-700">Returned</label>*/}
            {/*    <input*/}
            {/*        type="checkbox hidden"*/}
            {/*        checked={formData.isReturned || false}*/}
            {/*        readOnly*/}
            {/*        className="w-5 h-5"*/}
            {/*    />*/}
            {/*</div>*/}

            {/* bad debt status */}
            {/*<div className="mb-3">*/}
            {/*    <label className="block text-gray-700">Bad Debt</label>*/}
            {/*    <input*/}
            {/*        type="checkbox hidden"*/}
            {/*        checked={formData.isBadDebt || false}*/}
            {/*        readOnly*/}
            {/*        className="w-5 h-5"*/}
            {/*    />*/}
            {/*</div>*/}

            {/* return date */}
            <div className="mb-3">
                <label className="block text-gray-700">Return Date</label>
                <input
                    type="date"
                    name="returnDate"
                    value={
                        formData.returnDate
                            ? new Date(formData.returnDate).toISOString().slice(0, 10)
                            : ""
                    }
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            {/* Note */}
            <div className="mb-3">
                <label className="block text-gray-700">Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {loading ? "Updating..." : "Update Record"}
            </button>
        </form>
    );
}
