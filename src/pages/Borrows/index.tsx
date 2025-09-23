import { useEffect, useState } from "react";
import borrowApi from "../../services/borrowApi";
import  { type IBorrowRecord } from "../../types";
import BorrowCard from "../../components/BorrowRecordCard";
import SubMenu from "../../components/SubMenu.tsx";

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

        const handleDelete = async(id:string): Promise<void>=>{
                const confirmed = window.confirm("Are you sure to delete this borrow record?")
                if(!confirmed) return;
                if(id)await borrowApi.remove(id);
                setRecords(records.filter((r:IBorrowRecord)=>r._id!==id));
        }

        return (
            <div className="mx-auto w-full">
                   <SubMenu />


                    <h1  className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"}>📖 Filters</h1>

                    {/* filter */}
                    <div className="mb-6 px-3 space-y-2 w-full">
                            <div className="flex justify-between sm:justify-start items-center space-x-2">
                                    <span className="w-20 xl:w-30">Returned?</span>
                                    <label className="xl:mr-4  w-16 xl:w-24">
                                            <input
                                                type="radio"
                                                checked={returnFilter === "returned"}
                                                onChange={() => setReturnFilter("returned")}
                                            />{" "}
                                            Yes
                                    </label>
                                    <label className="xl:mr-4  w-16 xl:w-24">
                                            <input
                                                type="radio"
                                                checked={returnFilter === "notReturned"}
                                                onChange={() => setReturnFilter("notReturned")}
                                            />{" "}
                                            No
                                    </label>
                                    <label className="w-16 xl:w-24">
                                            <input
                                                type="radio"
                                                checked={returnFilter === "all"}
                                                onChange={() => setReturnFilter("all")}
                                            />{" "}
                                            All
                                    </label>
                            </div>

                            <div className="flex justify-between sm:justify-start items-center space-x-2">
                                    <span className="w-20 xl:w-30">Bad debt?</span>
                                    <label className="xl:mr-4  w-16 xl:w-24">
                                            <input
                                                type="radio"
                                                checked={debtFilter === "badDebt"}
                                                onChange={() => setDebtFilter("badDebt")}
                                            />{" "}
                                            Yes
                                    </label>
                                    <label className="xl:mr-4 w-16 xl:w-24">
                                            <input
                                                type="radio"
                                                checked={debtFilter === "notBadDebt"}
                                                onChange={() => setDebtFilter("notBadDebt")}
                                            />{" "}
                                            No
                                    </label>
                                    <label className="w-16 xl:w-24">
                                            <input
                                                type="radio"
                                                checked={debtFilter === "all"}
                                                onChange={() => setDebtFilter("all")}
                                            />{" "}
                                            All
                                    </label>
                            </div>
                    </div>


                    <h1 className={"my-4 py-2 ps-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl"}>📖 Borrow Records</h1>

                    {/* card list */}
                    {loading ? (
                        <p>Loading records...</p>
                    ) : filteredRecords.length === 0 ? (
                        <p className="text-gray-500">No borrow records found.</p>
                    ) : (
                        <div className={"w-full"}>
                                {filteredRecords.map((record) => (
                                    <BorrowCard key={record._id} record={record} handleDelete={handleDelete} />
                                ))}
                        </div>
                    )}
            </div>
        );
};

export default BorrowsPage;
