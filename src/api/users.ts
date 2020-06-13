import { buildUrl, apiHandleResponse } from "./helpers"
import { store } from "../store"
import { getAccessToken, Scope } from "./auth"
import SparkMD5 = require("spark-md5");

export type User = UserV3;

export interface UserV3 {
    id: string;
    emailHash: string;
    firstName: string;
}

export async function getUser(email: string) {
    const emailHash = SparkMD5.hash(email.toLowerCase().trim())

    const url = buildUrl(store.state.api, "api", "v3", "user", emailHash)
    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["RoleAssignments.Write"])}`
        }
    })

    return await apiHandleResponse<UserV3>(res, true)
}