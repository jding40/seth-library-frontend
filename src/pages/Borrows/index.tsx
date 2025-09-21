import { useEffect, useState } from "react";
import borrowApi from "../../services/borrowApi";
import  { type IBorrowRecord } from "../../types";
import BorrowCard from "../../components/BorrowRecordCard2";
import {Link} from "react-router-dom";

type ReturnFilter = "all" | "returned" | "notReturned";
type DebtFilter = "all" | "badDebt" | "notBadDebt";

const BorrowsPage = () => {
        const [records, setRecords] = useState<IBorrowRecord[]>([]);
        const [loading, setLoading] = useState(false);
        const [returnFilter, setReturnFilter] = useState<ReturnFilter>("all");
        const [debtFilter, setDebtFilter] = useState<DebtFilter>("all");

        useEffect(() => {
                const fetchRecords = async () => {
                        setLoading(true);
                        try {
                                const res = await borrowApi.getAll();
                                setRecords(res.data);
                        } catch (err) {
                                console.error("❌ Failed to fetch borrow records:", err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchRecords();
        }, []);

        const filteredRecords = records.filter((r) => {
                if (returnFilter === "returned" && !r.isReturned) return false;
                if (returnFilter === "notReturned" && r.isReturned) return false;
                if (debtFilter === "badDebt" && !r.isBadDebt) return false;
                if (debtFilter === "notBadDebt" && r.isBadDebt) return false;
                return true;
        });

        return (
            <div className="p-6 max-w-4xl mx-auto">
                    <div className="my-4">
                            <Link
                                to="/borrows/new"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                    📚 Create a New Borrow Record
                            </Link>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">📖 Borrow Records</h1>

                    {/* filter */}
                    <div className="mb-6 space-y-2">
                            <div className="flex items-center space-x-4">
                                    <span className="mr-2 xl:mr-4 font-medium w-45">Filter by return status:</span>
                                    <label className="mr-2 xl:mr-4 w-36">
                                            <input
                                                type="radio"
                                                checked={returnFilter === "returned"}
                                                onChange={() => setReturnFilter("returned")}
                                            />{" "}
                                            Returned
                                    </label>
                                    <label className="mr-2 xl:mr-4  w-36">
                                            <input
                                                type="radio"
                                                checked={returnFilter === "notReturned"}
                                                onChange={() => setReturnFilter("notReturned")}
                                            />{" "}
                                            Not Returned
                                    </label>
                                    <label>
                                            <input
                                                type="radio"
                                                checked={returnFilter === "all"}
                                                onChange={() => setReturnFilter("all")}
                                            />{" "}
                                            All
                                    </label>
                            </div>

                            <div className="flex items-center space-x-4">
                                    <span className="mr-2 xl:mr-4 font-medium w-45">Filter by bad debt:</span>
                                    <label className="mr-2 xl:mr-4 w-36">
                                            <input
                                                type="radio"
                                                checked={debtFilter === "badDebt"}
                                                onChange={() => setDebtFilter("badDebt")}
                                            />{" "}
                                            Bad Debt
                                    </label>
                                    <label className="mr-2 xl:mr-4  w-36">
                                            <input
                                                type="radio"
                                                checked={debtFilter === "notBadDebt"}
                                                onChange={() => setDebtFilter("notBadDebt")}
                                            />{" "}
                                            Normal
                                    </label>
                                    <label>
                                            <input
                                                type="radio"
                                                checked={debtFilter === "all"}
                                                onChange={() => setDebtFilter("all")}
                                            />{" "}
                                            All
                                    </label>
                            </div>
                    </div>

                    {/* card list */}
                    {loading ? (
                        <p>Loading records...</p>
                    ) : filteredRecords.length === 0 ? (
                        <p className="text-gray-500">No borrow records found.</p>
                    ) : (
                        <div>
                                {filteredRecords.map((record) => (
                                    <BorrowCard key={record._id} record={record} />
                                ))}
                        </div>
                    )}
            </div>
        );
};

export default BorrowsPage;
