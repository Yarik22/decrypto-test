import axios from "axios";
import env from "react-dotenv";

const instance = axios.create({
    baseURL: `${env.API_URL}`,
    headers:{
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    }
    
})

export default instance