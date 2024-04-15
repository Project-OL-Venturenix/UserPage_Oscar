import axios from "axios";
import DevConfig from "./DevConfig";
const baseUrl = DevConfig.baseUrl;
export const putUserTestCase = async (accessToken, userTestCaseData)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/usertestcases`,
            userTestCaseData,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getUserTestCase = async (accessToken)=> {
    try {
        const response = await axios.get(
            `${baseUrl}/api/usertestcases`,
            {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
