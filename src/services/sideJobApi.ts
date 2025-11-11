import http from "./http";
import {type IParseBomRecord} from "../types";


const sideJobApi ={
    saveParseBomRecord: (data: IParseBomRecord) => http.post<IParseBomRecord>("/save-bom-parse-record", data),
}

export default sideJobApi;