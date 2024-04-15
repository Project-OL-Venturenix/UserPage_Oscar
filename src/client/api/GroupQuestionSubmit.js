import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const putGroupQuestionSubmit = async (accessToken, groupQuestionData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/groupquestionsubmits`,
            groupQuestionData,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getGroupQuestionSubmit = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/groupquestionsubmits`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
