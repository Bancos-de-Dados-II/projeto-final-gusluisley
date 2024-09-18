import { useQuery } from "@tanstack/react-query";
import axios from "axios"

const API_URL = 'http://localhost:4000'
const fetchData = async() => {
    const response = await axios.get(API_URL)
    return response;
}

export function useRestaurantData(){
    const query = useQuery({
        queryFn:fetchData,
        queryKey: ['restaurant-data'],
        retry:2
    })
    return {
        ...query,
        data:query.data?.data
    }
}