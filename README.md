# Rex UI
**A web interface for Rex, the idea tracker that helps you manage ideas and randomly pick one to do.**

Rex UI is the frontend for [Rex](https://github.com/SierraSoftworks/rex-rs), a tool for keeping
track of ideas for things to do and providing, on demand, a random one. It connects to the
[Rex API](https://rex.sierrasoftworks.com) and allows you to manage your ideas through an
intuitive web interface.

## Features
 - **Idea Management** — Create, view, edit, tag, and delete ideas within collections.
 - **Random Selection** — Get a randomly selected idea on demand, optionally filtered by tag or completion status.
 - **Collections** — Organize ideas into collections and manage access with role-based permissions (Owner, Contributor, Viewer).
 - **Collaboration** — Invite other users to your collections and assign roles.
 - **Markdown Support** — Write idea descriptions in Markdown with syntax highlighting.
 - **Authentication** — Sign in with Azure AD via MSAL.

## Tech Stack
 - [Vue 3](https://vuejs.org/) (Composition API) + [TypeScript](https://www.typescriptlang.org/)
 - [Vite](https://vitejs.dev/) for development and production builds
 - [Element Plus](https://element-plus.org/) component library
 - [Vue Router](https://router.vuejs.org/) for client-side routing
 - [Vuex 4](https://vuex.vuejs.org/) for state management
 - [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js) for Azure AD authentication
 - [markdown-it](https://github.com/markdown-it/markdown-it) + [highlight.js](https://highlightjs.org/) for Markdown rendering

## Development

```bash
npm install   # Install dependencies
npm start     # Start the Vite dev server with hot-reload
npm run build # Type-check and build for production (output in ./dist)
```

## Deployment
Rex UI can be deployed as a static site or as a Docker container.

### Docker
```bash
docker build -t rex-ui .
docker run -p 8080:80 rex-ui
```

The Docker image uses a multi-stage build: Node.js builds the app, then the static assets are served by Nginx.

### Azure Blob Storage
The repository includes a GitHub Actions workflow that deploys the built site to Azure Blob Storage.

## Related Projects
 - [rex-rs](https://github.com/SierraSoftworks/rex-rs) — The Rex API server (Rust), which this UI connects to.

## License
This project is licensed under the [MIT License](./LICENSE).
