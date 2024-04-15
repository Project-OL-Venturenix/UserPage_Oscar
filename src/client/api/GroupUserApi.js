import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const getGroupUsers = async (accessToken, eventId) => {
    try {
        const response = await axios.get(
            `${baseUrl}/api/groups/${eventId}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch
        (error) {
        console.error(error);
        throw error;
    }
};
