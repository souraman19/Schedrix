"use server";

import { CREATE_TASKS_ROUTE } from "./apiRoutes";
import { parseServerActionResponse } from "./utils";
import axios from "axios";


export const createTask = async(state: any, form: FormData) => {
    try{
        console.log("Creating task with form data: ", form);
        const response = await axios.post(CREATE_TASKS_ROUTE, form, {withCredentials: true});
        console.log("Task created successfully: ", response.data);
        return parseServerActionResponse(response);
    }catch(err){
        console.error("Error creating task: ", err);
        return parseServerActionResponse({error: JSON.stringify(err), status: "ERROR"});
    }
}