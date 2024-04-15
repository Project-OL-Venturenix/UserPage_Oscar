import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const getQuestions = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/questions`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getQuestionsList = async (accessToken, eventId)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/questions/event/${eventId}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getQuestionById = async (accessToken,Id)=> {
    try {
        const response = await axios.get(
            `http://vtxlab-projectol-backend.ap-southeast-1.elasticbeanstalk.com:8080/api/questions/${Id}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
