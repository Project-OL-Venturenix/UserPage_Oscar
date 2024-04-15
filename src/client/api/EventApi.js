import axios from "axios";
import DevConfig from "./DevConfig";

const baseUrl = DevConfig.baseUrl;
export const getEvents = async (accessToken) => {
    try {
        const response = await axios.get(
            `${baseUrl}/api/events`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch
        (error) {
        console.error(error);
        throw error;
    }
};

export const getEventByid = async (accessToken, id) => {
    try {
        const response = await axios.get(
            `${baseUrl}/api/events/${id}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch
        (error) {
        console.error(error);
        throw error;
    }
};

export const putEventById = async (accessToken, id, status) => {
    try {
        const response = await axios.put(
            `${baseUrl}/api/events/${id}/${status}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch
        (error) {
        console.error(error);
        throw error;
    }
};