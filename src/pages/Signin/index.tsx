import { type FC } from "react";
import userApi from "../../services/userApi";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {getUserRole} from "../../utils"
// import { jwtDecode } from "jwt-decode";
// import { type IUserPayload } from "../../types";

const Login: FC = () => {
  const [email, setEmail] = useState<string>("test@email.com");
  const [password, setPassword] = useState<string>("test");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const res = await userApi.login(
          {
            email,
            password
          }
      )

      const { token } = res.data;

      //const decodedUser: IUserPayload = jwtDecode<IUserPayload>(token);
      //console.log("decodeduser: ", decodedUser);

      // save token to local storage
      localStorage.setItem("token", token);
      //localStorage.setItem("user", JSON.stringify(decodedUser));

      navigate("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const errorResponse = err as {
          response?: { data?: { message?: string } };
        };
        setError(errorResponse.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };


  useEffect(()=>{
    if(getUserRole() !=="guest"){
      console.log("user role in sign in page: ", getUserRole())
      navigate("/"); //You should call navigate() in a React.useEffect(), not when your component is first rendered.
    }

  },[])



  return (
    <div className="flex items-center justify-center h-full ">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md lg:mt-10 2xl:mt-20">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
