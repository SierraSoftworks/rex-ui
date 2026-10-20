import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser"

// MSAL requires the WebCrypto API (window.crypto.subtle), which browsers only expose in secure
// contexts (HTTPS or localhost) and which some very old browsers and embedded webviews lack. Without
// it the PublicClientApplication constructor throws "BrowserAuthError: crypto_nonexistent" while this
// module is being imported, which stops the whole app from loading. Instead, we skip creating the
// client and surface a clear error when the user tries to sign in.
const authSupported = typeof window !== "undefined" && !!window.crypto?.subtle

const msalApp: PublicClientApplication | null = authSupported ? new PublicClientApplication({
    auth: {
        clientId: "e284d597-f080-406d-a3fc-91f18eca6baa",
        authority: "https://login.microsoftonline.com/a26571f1-22b3-4756-ac7b-39ca684fab48",
        redirectUri: window.location.origin
    }
}) : null

const msalInitialized: Promise<void> = msalApp ? msalApp.initialize() : Promise.resolve()

function requireMsalApp(): PublicClientApplication {
    if (!msalApp) {
        throw new Error("Signing in requires a browser with Web Crypto support, opened over HTTPS. Please open Rex over https:// in an up-to-date browser (not an in-app or embedded browser) and try again.")
    }

    return msalApp
}

export enum Scope {
    "Ideas.Read" = "https://rex.sierrasoftworks.com/Ideas.Read",
    "Ideas.Write" = "https://rex.sierrasoftworks.com/Ideas.Write",
    "Collections.Read" = "https://rex.sierrasoftworks.com/Collections.Read",
    "Collections.Write" = "https://rex.sierrasoftworks.com/Collections.Write",
    "RoleAssignments.Write" = "https://rex.sierrasoftworks.com/RoleAssignments.Write"
}

export function getAccount(): AccountInfo | null {
    if (!msalApp) return null

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

    const auth = await requireMsalApp().loginPopup({ scopes })
    return auth.account
}

export function logout() {
    msalApp?.logoutPopup()
}

export async function getAccessToken(...scopes: Scope[]): Promise<string> {
    const msalApp = requireMsalApp()
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