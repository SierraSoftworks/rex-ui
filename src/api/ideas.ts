import { buildUrl, apiHandleResponse } from "./helpers"
import { store } from "../store"
import { getAccessToken, Scope } from "./auth"

export type Idea = IdeaV3

export interface IdeaV3 {
    id?: string
    collection?: string
    name: string
    description: string
    tags?: string[]
    completed?: boolean
}

export async function newIdea(idea: IdeaV3) {
    let url = buildUrl(store.state.api, "api", "v3", "ideas")

    if (idea.collection)
        url = buildUrl(store.state.api, "api", "v3", "collection", idea.collection, "ideas")

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await getAccessToken(Scope["Ideas.Write"])}`
        },
        body: JSON.stringify(idea)
    })

    return await apiHandleResponse<IdeaV3>(res, true)
}

export async function getIdea(ideaId?: string, collectionId?: string) {
    let url = buildUrl(store.state.api, "api", "v3", "idea", ideaId)

    if (collectionId)
        url = buildUrl(store.state.api, "api", "v3", "collection", collectionId, "idea", ideaId)

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["Ideas.Read"])}`
        }
    })

    return await apiHandleResponse<IdeaV3>(res, true)
}

export async function getIdeas(collectionId?: string) {
    let url = buildUrl(store.state.api, "api", "v3", "ideas")

    if (collectionId)
        url = buildUrl(store.state.api, "api", "v3", "collection", collectionId, "ideas")

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["Ideas.Read"])}`
        }
    })

    return await apiHandleResponse<IdeaV3[]>(res, true)
}

export async function storeIdea(idea: IdeaV3) {
    let url = buildUrl(store.state.api, "api", "v3", "idea", idea.id)

    if (idea.collection)
        url = buildUrl(store.state.api, "api", "v3", "collection", idea.collection, "idea", idea.id)

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await getAccessToken(Scope["Ideas.Write"])}`
        },
        body: JSON.stringify(idea)
    })

    return await apiHandleResponse<IdeaV3>(res, true)
}