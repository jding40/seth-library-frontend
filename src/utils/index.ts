import {type IUserPayload, type RoleType} from '../types';
import {jwtDecode} from "jwt-decode";

const getUserRole = ():RoleType=>{
    const token: string | null= localStorage.getItem("token");
    if (!token) return "guest";
    try {
        const decoded:IUserPayload = jwtDecode<IUserPayload>(token);
        if (!decoded.role) return "guest";
        return decoded.role;
    } catch (error) {
        console.error("Invalid token:", error);
        return "guest"; // role will be guest if token is illegal
    }
}

const getUserEmail = ():string|undefined=>{
    const token: string | null= localStorage.getItem("token");
    if(!token)throw new Error("Not implemented yet");
    try {
        const decoded:IUserPayload = jwtDecode<IUserPayload>(token);
        return decoded.email;
    } catch (error) {
        console.error("Error:", error);
    }
}

const getCurrentUser = ():IUserPayload|undefined=>{
    const token: string | null= localStorage.getItem("token");
    if(!token)throw new Error("Not implemented yet");
    try {
        const decoded:IUserPayload = jwtDecode<IUserPayload>(token);
        return decoded;
    }catch (error) {
        console.error("Error:", error);
    }
}


export {getUserRole, getUserEmail, getCurrentUser};