import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const getEventUsers = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/eventusers`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getEventUser = async (accessToken,eventid)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/user/eventid/${eventid}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};