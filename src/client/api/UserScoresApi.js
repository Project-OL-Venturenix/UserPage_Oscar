import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const createUserScores = async (accessToken, userScoreData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/userscores/addScore`,
            null,
            {
            params:userScoreData,
            headers: {Authorization: `Bearer ${accessToken}`}
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const putUserScores = async (accessToken, id, userScoreData)=> {
    try {
        const response = await axios.put(
            `${baseUrl}/api/userscores/${id}`,
            userScoreData,
            { headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserScores = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/userscores`,
            { headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserScoresByEventId = async (accessToken, id)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/usertestcases/eventId/${id}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addUserScores = async (accessToken, userScoreData, userQuestionData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/userscores/addScore`,
            userQuestionData,
            {
                params:userScoreData,
                headers: {Authorization: `Bearer ${accessToken}`}
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserScores = async (accessToken, userScoreData, userQuestionData)=> {
    try {
        const response = await axios.put(
            `${baseUrl}/api/userscores/updateScore`,
            userQuestionData,
            {
                params:userScoreData,
                headers: {Authorization: `Bearer ${accessToken}`}
            }
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


