import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = 'http://localhost:4000/restaurants';

// Função para buscar dados com base em um termo de pesquisa
export const fetchSearchResults = async (searchText) => {
    const response = await axios.get(API_URL+'/busca/'+searchText);
    return response.data; // Retornamos os dados da resposta diretamente
};

