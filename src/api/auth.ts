import * as msal from "msal"

const msalApp = new msal.UserAgentApplication({
    auth: {
        clientId: "e284d597-f080-406d-a3fc-91f18eca6baa",
        authority: "https://login.microsoftonline.com/a26571f1-22b3-4756-ac7b-39ca684fab48",
        redirectUri: window.location.origin
    }
})

export enum Scope {
    "Ideas.Read" = "https://rex.sierrasoftworks.com/Ideas.Read",
    "Ideas.Write" = "https://rex.sierrasoftworks.com/Ideas.Write",
    "Collections.Read" = "https://rex.sierrasoftworks.com/Collections.Read",
    "Collections.Write" = "https://rex.sierrasoftworks.com/Collections.Write",
    "RoleAssignments.Write" = "https://rex.sierrasoftworks.com/RoleAssignments.Write"
}

export function getAccount(): msal.Account {
    return msalApp.getAccount()
}

export async function login(...scopes: Scope[]): Promise<msal.Account> {
    if (msalApp.getAccount()) return msalApp.getAccount()

    const auth = await msalApp.loginPopup({ scopes })
    return auth.account
}

export function logout() {
    msalApp.logout()
}

export async function getAccessToken(...scopes: Scope[]): Promise<string> {
    await login(...scopes)

    return msalApp.acquireTokenSilent({ scopes })
        .catch(err => {
            if (err.name !== "InteractionRequiredAuthError") throw err
            return msalApp.acquireTokenPopup({ scopes })
        })
        .then(resp => resp.accessToken)
}