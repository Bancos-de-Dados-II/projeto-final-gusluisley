import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = 'http://localhost:4000/';

// Função para deletar um dado específico
const deleteData = async (name) => {
    const response = await axios.delete(API_URL+'restaurants/'+name);
    return response;
}

export function useRestaurantDeleteMutate() {
    const queryClient = useQueryClient();

    const deleteMutate = useMutation({
        mutationFn: deleteData,
        retry: 2,  // Tentativas de repetição em caso de falha
        onSuccess: () => {
            // Invalida a query com a chave 'restaurant-data' para refazer o fetch após o sucesso da mutação
            queryClient.invalidateQueries(['restaurant-data']);
        },
    });

    return deleteMutate;
}