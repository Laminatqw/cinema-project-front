import {IMovie} from "../models/IMovie";
import {baseUrl, urls} from "../constants/urls";
import {IGenre} from "../models/IGenre";
import axios from "axios";
import {PaginatedModel} from "../models/PaginatedModel";
import {IMovieFilter} from "../models/IMovieFilter";
import {data} from "react-router-dom";
import {axiosInstance} from "../helpers/axiosInstance";


export const movieServices = {

    getAll: async (filters?:IMovieFilter):Promise<PaginatedModel<IMovie>> =>{
      const response = await axiosInstance.get(urls.movies.base,{params:filters})
      return response.data
    },
    getById: async (id: number): Promise<IMovie> => {
        let response = await axiosInstance.get<IMovie>(urls.movies.byId(id));
        return response.data;
    },
    createMovie: async (payload: Partial<IMovie>): Promise<IMovie> => {
        let response = await axiosInstance.post<IMovie>(urls.movies.base, payload);
        return response.data;
    },
    updateMovie: async (id: number, payload: Partial<IMovie>): Promise<IMovie> => {
        let response = await axiosInstance.patch<IMovie>(urls.movies.byId(id), payload);
        return response.data;
    },
    deleteMovie: async (id: number): Promise<IMovie> => {
        let response = await axiosInstance.delete<IMovie>(urls.movies.byId(id));
        return response.data;
    },
    loadPicture: async (id: number, file:File): Promise<IMovie> => {
        const formData = new FormData()
        formData.append('picture', file)

        const { data } = await axiosInstance.patch<IMovie>(
            urls.movies.addPicture(id),
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        )
        return data
    },
    getAllGenres: async (): Promise<IGenre[]> => {
        let response = await axiosInstance.get<{data:IGenre[]}>(urls.movies.genres());
        console.log(response.data)
        return response.data.data;

    },
    getGenreById: async (id: number): Promise<IGenre> => {
        let response = await axiosInstance.get<IGenre>(urls.movies.genresById(id));
        return response.data;
    },
    genreCreate: async (payload: Partial<IGenre>): Promise<IGenre> => {
        let response = await axiosInstance.post<IGenre>(urls.movies.genres(), payload);
        return response.data;

    },
    genreUpdate: async (id: number, payload: Partial<IGenre>): Promise<IGenre> => {
        let response = await axiosInstance.patch<IGenre>(urls.movies.genresById(id), payload);
        return response.data;
    },
    genreDelete: async (id: number): Promise<IGenre> => {
        let response = await axiosInstance.get<IGenre>(urls.movies.genresById(id));
        return response.data;
    }}