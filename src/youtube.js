import axios from "axios"

export default axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    params: {
        key: "********************", 
        type: "video", 
        part: "snippet",
        maxResults: 5
    }
})