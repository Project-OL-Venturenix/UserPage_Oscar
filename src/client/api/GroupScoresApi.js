import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const putGroupScores = async (accessToken, groupScoreData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/groupscores`,
            groupScoreData,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        )
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getGroupScoresByEventId = async (accessToken, id)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/groups/eventid/${id}`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};