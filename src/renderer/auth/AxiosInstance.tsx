import axios from "axios";

export const AxiosInstance = (bearerToken: string) => axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
    },
})