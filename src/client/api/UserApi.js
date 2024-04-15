import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const getUsers = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/users`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserById = async (accessToken,id)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/users/${id}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};