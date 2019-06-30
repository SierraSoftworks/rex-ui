
import * as msal from "Msal";

const msalConfig: msal.Configuration = {
    auth: {
        clientId: 'e284d597-f080-406d-a3fc-91f18eca6baa',
        authority: "https://login.microsoftonline.com/a26571f1-22b3-4756-ac7b-39ca684fab48",
        redirectUri: `${window.location.origin}`
    },
    cache: {
        cacheLocation: "localStorage"
    }
};

const appOAuthScopes = [
    "https://rex.sierrasoftworks.com/Ideas.Read",
    "https://rex.sierrasoftworks.com/Ideas.Write",
]

class AuthManager {
    msalClient = new msal.UserAgentApplication(msalConfig);

    private authPromise: Promise<msal.AuthResponse> = null;

    login(): Promise<msal.AuthResponse> {
        if (this.msalClient.getLoginInProgress()) {
            return this.authPromise || Promise.reject(new Error("undefined state"));
        }

        this.authPromise = this.msalClient.loginPopup({
            scopes: appOAuthScopes
        });

        return this.authPromise;
    }

    logout(): Promise<void> {
        this.msalClient.logout();
        return Promise.resolve();
    }

    getAccessToken(): Promise<string> {
        return this.msalClient.acquireTokenSilent({
            scopes: appOAuthScopes
        }).then(res => res, _ => this.msalClient.acquireTokenPopup({
            scopes: appOAuthScopes
        })).then(res => res.accessToken);
    }

    getAuthHeaders(): Promise<{}> {
        return this.getAccessToken().then(token => ({ "Authorization": `Bearer ${token}` }));
    }

    getUsername(): string {
        const account = this.msalClient.getAccount();
        if (!account) return null;

        return account.userName;
    }
}

const authManager = new AuthManager();

export default authManager;
