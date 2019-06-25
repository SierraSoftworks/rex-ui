import { store } from "../store";
import * as helpers from "./helpers";

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

//const ideasServer = "https://rex.sierrasoftworks.com"
const ideasServer = "https://private-anon-ceb362451e-randyapp.apiary-mock.com"

//Queries the API server for Gets the list of ideas registered with the server.
export function getIdeasV1() {
    return fetch(helpers.buildUrl(ideasServer, `/api/v1/ideas`))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function getIdeasV2() {
    return fetch(helpers.buildUrl(ideasServer, `/api/v2/ideas`))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Creates a new idea on the server.
export function postIdeaV1(idea: IdeaV1) {
    return fetch(helpers.buildUrl(ideasServer, `/api/v1/ideas`), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idea)
    })
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function postIdeaV2(idea: IdeaV2) {
    return fetch(helpers.buildUrl(ideasServer, `/api/v2/ideas`))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Gets a single randomly selected idea from the server.
export function getRandomIdeaV1() {
    return fetch(helpers.buildUrl(ideasServer, `/api/v1/idea/random`))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function getRandomIdeaV2() {
    return fetch(helpers.buildUrl(ideasServer, `/api/v2/idea/random`))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Gets a specific idea from the server based on its ID.
export function getIdeaByIdV1(id: string) {
    return fetch(helpers.buildUrl(ideasServer, `/api/v1/idea`, id))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function getIdeaByIdV2(id: string) {
    return fetch(helpers.buildUrl(ideasServer, `/api/v2/idea`, id))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}

//Stores an idea idempotently with the given identifier, replacing an existing instance if one is present.
export function putIdeaV1() {
    return fetch(helpers.buildUrl(ideasServer, `/api/v1/idea/id`))
        .then(res => helpers.apiHandleResponse<IdeaV1>(res, true))
}
export function putIdeaV2() {
    return fetch(helpers.buildUrl(ideasServer, `/api/v2/idea/id`))
        .then(res => helpers.apiHandleResponse<IdeaV2>(res, true))
}
