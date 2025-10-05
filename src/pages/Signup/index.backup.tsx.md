// src/pages/auth/Signup.tsx
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";

const Signup: FC = () => {
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [firstName, setFirstName] = useState<string>("");
const [lastName, setLastName] = useState<string>("");
const [tel, setTel] = useState<string>("");
const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const payload: Record<string, string> = { email, password };
            if (firstName) payload.firstName = firstName;
            if (lastName) payload.lastName = lastName;
            if (tel) payload.tel = tel;
            payload.role="user";

            await userApi.register(payload);

            // 注册成功 → 跳转到登录页
            navigate("/signin");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const errorResponse = err as {
                    response?: { data?: { message?: string } };
                };
                setError(errorResponse.response?.data?.message || "Signup failed");
            } else {
                setError("Signup failed");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md lg:mt-10 2xl:mt-20">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Sign Up
                </h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700">Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Tel */}
                    <div>
                        <label className="block text-gray-700">Tel</label>
                        <input
                            type="tel"
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
