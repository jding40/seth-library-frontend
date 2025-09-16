import {type IUserPayload} from '../types';
import {jwtDecode} from "jwt-decode";

const getUserRole = ():"admin"| "guest" =>{
    const token: string | null= localStorage.getItem("token");
    if (!token) return "guest";
    return jwtDecode<IUserPayload>(token).role;
}


export {getUserRole};