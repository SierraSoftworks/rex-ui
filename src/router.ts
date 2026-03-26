import { createRouter, createWebHistory, RouteLocationNormalized } from "vue-router"

/**
 * Helper method to parse query parameters and route parameters into
 * a route's `props` property. Define the route with `{ props: routeProps }`
 * to enable this.
 * @param route The route that should have its properties populated
 */
function props(route: RouteLocationNormalized) {
    return Object.assign({}, route.query, route.params);
}

const routes = [
    { name: 'home', path: "/", component: () => import("./views/HomeView.vue") },
    { name: 'collection', path: "/collection/:collectionId", component: () => import("./views/HomeView.vue"), props },
    { name: 'idea', path: "/collection/:collectionId/idea/:ideaId", component: () => import("./views/IdeaView.vue"), props },
    { name: 'new', path: "/collection/:collectionId/new", component: () => import("./views/NewView.vue"), props },
    { name: 'newCollection', path: "/collections/new", component: () => import("./views/NewCollectionView.vue"), props },
    { name: 'collections', path: "/collections", component: () => import("./views/CollectionsView.vue") },
    { name: 'manageCollection', path: "/collection/:collectionId/manage", component: () => import("./views/CollectionView.vue"), props },
    { name: 'inviteUser', path: "/collection/:collectionId/invite", component: () => import("./views/InviteView.vue"), props }
]

export const router = createRouter({
    routes,
    history: createWebHistory(),
    linkActiveClass: "active"
})