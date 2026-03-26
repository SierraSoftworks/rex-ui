import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser"

const msalApp = new PublicClientApplication({
    auth: {
        clientId: "e284d597-f080-406d-a3fc-91f18eca6baa",
        authority: "https://login.microsoftonline.com/a26571f1-22b3-4756-ac7b-39ca684fab48",
        redirectUri: window.location.origin
    }
})

const msalInitialized = msalApp.initialize()

export enum Scope {
    "Ideas.Read" = "https://rex.sierrasoftworks.com/Ideas.Read",
    "Ideas.Write" = "https://rex.sierrasoftworks.com/Ideas.Write",
    "Collections.Read" = "https://rex.sierrasoftworks.com/Collections.Read",
    "Collections.Write" = "https://rex.sierrasoftworks.com/Collections.Write",
    "RoleAssignments.Write" = "https://rex.sierrasoftworks.com/RoleAssignments.Write"
}

export function getAccount(): AccountInfo | null {
    const accounts = msalApp.getAllAccounts()
    return accounts.length > 0 ? accounts[0] : null
}

export async function getAccountAsync(): Promise<AccountInfo | null> {
    await msalInitialized
    return getAccount()
}

export async function login(...scopes: Scope[]): Promise<AccountInfo> {
    await msalInitialized

    const account = getAccount()
    if (account) return account

    const auth = await msalApp.loginPopup({ scopes })
    return auth.account
}

export function logout() {
    msalApp.logoutPopup()
}

export async function getAccessToken(...scopes: Scope[]): Promise<string> {
    await msalInitialized

    const account = await login(...scopes)

    try {
        const resp = await msalApp.acquireTokenSilent({ scopes, account })
        return resp.accessToken
    } catch (err: any) {
        if (err instanceof InteractionRequiredAuthError) {
            const resp = await msalApp.acquireTokenPopup({ scopes })
            return resp.accessToken
        }
        throw err
    }
}