import { type FC, useEffect, useState } from "react";
import classnames from "classnames";
import userApi from "../../services/userApi.ts";
import { type IUser} from "../../types";
import SubMenu from "../../components/SubMenu.tsx";
import { getUserEmail } from "../../utils";

const UsersPage: FC = () => {
        const [loading, setLoading] = useState<boolean>(true);
        const [users, setUsers] = useState<IUser[]>([]);


        const selfEmail: string | undefined = getUserEmail();

        useEffect(() => {
                const fetchUsers = async () => {
                        try {
                                const res = await userApi.getAll();
                                console.log("users: ", res.data);
                                setUsers(res.data.filter((u) => u.email !== selfEmail));
                        } catch (error) {
                                console.error("❌ Failed to fetch users:", error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchUsers();
        }, []);

        // const handleSwitchRole2 = async (userId: string) => {
        //         try {
        //                 await userApi.switchRole(userId);
        //                 // update users
        //                 setUsers((prev:IUser[]) =>
        //                     prev.map((u:IUser) => {
        //                             if (u.email!==selfEmail) return u;
        //                             else return{...u, role: u.role==="admin"?"user":"admin"}
        //                         }
        //                     )
        //                 );
        //         } catch (error) {
        //                 console.error("❌ Failed to switch role:", error);
        //         }
        // };

        const handleSwitchRole = async (userId: string) => {
                try {
                        await userApi.switchRole(userId);

                        // switch role
                        setUsers((prev: IUser[]) =>
                            prev.map((u: IUser) =>
                                u._id === userId
                                    ? { ...u, role: u.role === "admin" ? "user" : "admin" }
                                    : u
                            )
                        );
                } catch (error) {
                        console.error("❌ Failed to switch role:", error);
                }
        };

        const handleDelete = async (id: string)=>{
                const confirmed:boolean = confirm("Are you sure to delete this user?");
                if(!confirmed) return;
                try {
                        await userApi.delete(id);
                        const updatedUsers = users.filter((u) => u._id !== id);
                        setUsers(updatedUsers);
                }catch(err){
                        console.error(err);
                }
        }

        const concatName = (user: IUser)=>{
                let name= "";
                if(!user.firstName && !user.lastName) return "nobody";
                if(user.firstName) name=name+user.firstName;
                if(user.lastName) name=name+" " + user.lastName;
                return name.trim();

        }



        if (loading) {
                return <div className="p-4">Loading users...</div>;
        }

        console.log("users: ",users)

        return (
            <div className="">
                    {/* Sub-menu */}
                    <SubMenu />

                    {/* Title */}
                    <section className="">
                            <div className={"relative"}>
                                    <h1 className=" mt-5 mb-2 ps-20 py-2 rounded-md bg-blue-700 text-white font-[Grenze_Gotisch] text-2xl">
                                            Users
                                    </h1>
                                    <span className={"absolute bottom-2  text-6xl"}>🧑🏻‍🤝‍🧑🏽</span>
                            </div>

                            {/* user table */}
                            <div className="overflow-x-auto rounded-md shadow">
                                    <table className="min-w-full text-sm text-left border border-gray-200">
                                            <thead className="bg-gray-100 text-gray-700">
                                            <tr>
                                                    <th className="px-4 py-2 border-b">Email</th>
                                                    <th className="px-4 py-2 border-b">Name</th>
                                                    <th className="px-4 py-2 border-b">Role</th>
                                                    <th className="px-4 py-2 border-b">Set Role</th>
                                                    <th className="px-4 py-2 border-b">Delete</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {users.map((user, idx) => (
                                                <tr
                                                    key={user._id}
                                                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                                >
                                                        <td className="px-4 py-2 border-b">{user.email}</td>
                                                        <td className="px-4 py-2 border-b">{concatName(user)}</td>
                                                        <td className="px-4 py-2 border-b">{user.role}</td>
                                                        <td className="px-4 py-2 border-b">
                                                                {user.role!=="owner" && <button
                                                                    onClick={  () => handleSwitchRole(user._id || "defaultID")}
                                                                    className= {classnames("px-3 py-1 text-xs font-medium text-white rounded bg-blue-600 hover:bg-blue-700"
                                                                    )}
                                                                >
                                                                        {user.role === "user" ? "Set Admin" : "Set User"}
                                                                </button>}
                                                        </td>
                                                        <td className="px-4 py-2 border-b "> {user.role !== "owner" && <span className={"material-symbols-outlined text-red-600 cursor-pointer"} onClick={()=>handleDelete(user._id as string)}>delete</span>}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                    </table>
                            </div>
                    </section>
            </div>
        );
};

export default UsersPage;
