import { Navigate } from "react-router-dom";
import {getUserRole} from "../utils";
import {type RoleType} from "../types";
import { type JSX, type ReactNode} from "react";
// import NavBar from "../components/Navbar";

interface RequireAuthProps {
    children: ReactNode;
    roles: RoleType[]; // 要求的角色
}

// const  RequireAuth:FC<RequireAuthProps> = ({ children, role }) => {
//     const userRole:RoleType = getUserRole();
//
//     if (role === "admin" && userRole === "guest") {
//         return <Navigate to="/login" replace />;
//     }
//     if (role === "admin" && userRole ==="user" ) {
//         return <div className="p-4 text-red-600">Sorry, only {role} is authorized! </div>;
//     }
//
//     return children;
// }
//
// export default RequireAuth;
export function RequireAuth({ children, roles }: RequireAuthProps): JSX.Element {
    const userRole: RoleType = getUserRole();


    if (!roles.includes(userRole)) {
        return userRole == "guest"? <Navigate to="/signin" replace /> : <div className="p-4 text-red-600">Sorry, only {roles.join(", ")} is authorized! </div>;
    }

    return <>{children}</>;
}