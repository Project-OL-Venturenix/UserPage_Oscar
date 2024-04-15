import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const createUserQuestionSubmit = async (accessToken, userQuestionData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/userquestionsubmits`,
            userQuestionData,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserQuestionSubmit = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/userquestionsubmits`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const putUserQuestionSubmit = async (accessToken, id, userQuestionData)=> {
    try {
        const response = await axios.put(
            `http://vtxlab-projectol-backend.ap-southeast-1.elasticbeanstalk.com:8080/api/userquestionsubmits/${id}`,
            userQuestionData,
            { headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
