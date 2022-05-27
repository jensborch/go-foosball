import { Api, ApiConfig } from "./Api";

export function toLocaleDateString(date: string | undefined): string | undefined {
    return date === undefined ? undefined : new Date(date).toLocaleDateString();
}

const conf:  ApiConfig = {
    baseUrl:  "http://localhost:8080"   
}

export const api = new Api(conf);