import axios from "axios";
import DevConfig from "./DevConfig";

const baseUrl = DevConfig.baseUrl;
export const signInUser = async (userName, password)=> {
    try {
        const response = await axios.post(
            `${baseUrl}/api/auth/signin`,
            {userName, password}
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const signUpUser = async (userData) => {
    try {
        console.log(userData)
        const response = await axios.post(
                `${baseUrl}/api/auth/signup`,
                userData
            );
        return response;
    } catch
        (error) {
        console.error(error);
        throw error;
    }
};