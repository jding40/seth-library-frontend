import {type IUserPayload, type RoleType} from '../types';
import {jwtDecode} from "jwt-decode";

const getUserRole = ():RoleType=>{
    const token: string | null= localStorage.getItem("token");
    //console.log("token in utils.getUserRole: ", token);
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

const getMajorShelfList = (shelfList:string[]):string[]=>{
    return shelfList.reduce((acc:string[], shelf:string)=>{
        const major:string = shelf.split("-")[0];

        if(!acc.includes(major)){
            acc.push(major);
        }
        return acc;
    },[])
}

const getMinorShelfList = (shelfList:string[], majorShelfLocation:string):string[] =>{
    const filteredShelfList:string[] = shelfList.filter((shelf:string)=>shelf.split("-")[0]===majorShelfLocation);
    return filteredShelfList.map((shelf:string)=>shelf.split("-")[1]);

}

export {getUserRole, getUserEmail, getCurrentUser, getMajorShelfList, getMinorShelfList};