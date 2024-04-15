import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const addEventGroupUserQuestionHandle = async (accessToken, questionData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/groupuserquestionhandle/add`,
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
            `${baseUrl}/api/groupuserquestionhandles`,

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
            `${baseUrl}/api/groupuserquestionhandles/${id}`,
            questionData,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return updatedResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};