import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const addEventGroupUserQuestionHandle = async (accessToken, questionData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/groupUserQuestionHandle/add`,
            questionData,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getEventGroupUserQuestionHandle = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/groupUserQuestionHandles`,

            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const putEventGroupUserQuestionHandle = async (accessToken, id, questionData) => {
    try {
        const updatedResponse = await axios.put(
            `${baseUrl}/api/groupUserQuestionHandles/${id}`,
            questionData,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return updatedResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};