import { store } from "../store";
import * as helpers from "./helpers";
import authManager from "./auth";

export interface IdeaV1 {
    id?: string;
    name: string;
    description: string;
}

export interface IdeaV2 {
    id?: string;
    name: string;
    description: string;
    tags: string[];
    completed?: boolean;
}

const ideasServer = "https://rex.sierrasoftworks.com"
//const ideasServer = "https://private-anon-ceb362451e-randyapp.apiary-mock.com"

//Queries the API server for Gets the list of ideas registered with the server.
export function getIdeasV1() {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v1/ideas`), { headers }))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function getIdeasV2() {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v2/ideas`), { headers }))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Creates a new idea on the server.
export function postIdeaV1(idea: IdeaV1) {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v1/ideas`), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify(idea)
        }))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function postIdeaV2(idea: IdeaV2) {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v2/ideas`), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify(idea)
        }))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Gets a single randomly selected idea from the server.
export function getRandomIdeaV1() {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v1/idea/random`), { headers }))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function getRandomIdeaV2() {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v2/idea/random`), { headers }))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Gets a specific idea from the server based on its ID.
export function getIdeaByIdV1(id: string) {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v1/idea`, id), { headers }))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function getIdeaByIdV2(id: string) {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v2/idea`, id), { headers }))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Stores an idea idempotently with the given identifier, replacing an existing instance if one is present.
export function putIdeaV1(id: string, idea: IdeaV1) {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v1/idea`, id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify(idea)
        }))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function putIdeaV2(id: string, idea: IdeaV2) {
    return authManager.getAuthHeaders()
        .then(headers => fetch(helpers.buildUrl(ideasServer, `/api/v2/idea`, id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify(idea)
        }))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}
