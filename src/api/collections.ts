import { buildUrl, apiHandleResponse } from "./helpers"
import { store } from "../store"
import { getAccessToken, Scope } from "./auth"

export type Collection = CollectionV3

export interface CollectionV3 {
    id?: string
    userId?: string
    name: string
}

export async function newCollection(collection: CollectionV3) {
    let url = buildUrl(store.state.api, "api", "v3", "collections")

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await getAccessToken(Scope["Collections.Write"])}`
        },
        body: JSON.stringify(collection)
    })

    return await apiHandleResponse<CollectionV3>(res, true)
}

export async function getCollection(collectionId: string) {
    let url = buildUrl(store.state.api, "api", "v3", "collection", collectionId)

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["Collections.Read"])}`
        }
    })

    return await apiHandleResponse<CollectionV3>(res, true)
}

export async function getCollections() {
    let url = buildUrl(store.state.api, "api", "v3", "collections")

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["Collections.Read"])}`
        }
    })

    return await apiHandleResponse<CollectionV3[]>(res, true)
}