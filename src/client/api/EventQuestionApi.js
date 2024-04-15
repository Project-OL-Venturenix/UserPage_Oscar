import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const getEventQuestions = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/eventquestions`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};