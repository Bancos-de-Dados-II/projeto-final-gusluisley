import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"

const API_URL = 'http://localhost:4000'
const postData = async(data) => {
    const response = await axios.post(API_URL, data)
    return response;
}

export function useRestaurantDataMutate(){
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn:postData,
        retry:2,
        onSuccess:() => {
            queryClient.invalidateQueries(['restaurant-data']);
        }
    })
    return mutate;
}