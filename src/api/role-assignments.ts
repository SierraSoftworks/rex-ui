import { buildUrl, apiHandleResponse } from "./helpers"
import { store } from "../store"
import { getAccessToken, Scope } from "./auth"

export type RoleAssignment = RoleAssignmentV3;
export type Role = "Owner" | "Contributor" | "Viewer";

export interface RoleAssignmentV3 {
    userId: string;
    collectionId: string;
    role: Role;
}

export async function getRoleAssignments(collectionId: string) {
    const url = buildUrl(store.state.api, "api", "v3", "collection", collectionId, "users")
    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["RoleAssignments.Write"])}`
        }
    })

    return await apiHandleResponse<RoleAssignmentV3[]>(res, true)
}

export async function setRoleAssignment(roleAssignment: RoleAssignmentV3) {
    const url = buildUrl(store.state.api, "api", "v3", "collection", roleAssignment.collectionId, "user", roleAssignment.userId)
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["RoleAssignments.Write"])}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(roleAssignment)
    })

    return await apiHandleResponse<RoleAssignmentV3>(res, true)
}

export async function removeRoleAssignment(collectionId: string, userId: string) {
    const url = buildUrl(store.state.api, "api", "v3", "collection", collectionId, "user", userId)
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${await getAccessToken(Scope["RoleAssignments.Write"])}`
        }
    })

    return await apiHandleResponse(res).then(() => true)
}