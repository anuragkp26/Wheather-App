import axios from 'axios';
import {apiKey} from '../constants'

const BASEURL = "https://api.weatherapi.com/v1/"

const forecastEndpoint = params => `forecast.json?key=${apiKey}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`
const locationEndpoint = params => `search.json?key=${apiKey}&q=${params.city}`


const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: BASEURL + endpoint
    }

    try {

        const response = await axios.request(options)
        return response.data;

    } catch(err) {
        console.log("api error :", err);
        return null;
    }
}

export const fetchForecast = params => {
    let forecastUrl = forecastEndpoint(params);

    return apiCall(forecastUrl);
}

export const fetchLocations = params => {
    return apiCall(locationEndpoint(params));
}