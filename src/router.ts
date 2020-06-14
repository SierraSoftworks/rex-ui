import Vue from "vue";
import VueRouter from "vue-router";
import { Route } from "vue-router";
import { store } from "./store";

Vue.use(VueRouter);

/**
 * Helper method to parse query parameters and route parameters into
 * a route's `props` property. Define the route with `{ props: routeProps }`
 * to enable this.
 * @param route The route that should have its properties populated
 */
function props(route: Route) {
    return Object.assign({}, route.query, route.params);
}

/**
 * Allows you to load a component asynchronously, provided that component
 * exports itself as the default export on its module.
 * @param module The path of the module that the component is defined in
 */
function asyncComponent(module: string) {
    return () => new Promise((resolve) => {
        requirejs([module], function (component) {
            resolve(component.default)
        })
    })
}

const routes = [
    { name: 'home', path: "/", component: asyncComponent("views/home") },
    { name: 'collection', path: "/collection/:collectionId", component: asyncComponent("views/home"), props },
    { name: 'idea', path: "/collection/:collectionId/idea/:ideaId", component: asyncComponent("views/idea"), props },
    { name: 'new', path: "/collection/:collectionId/new", component: asyncComponent("views/new"), props },
    { name: 'newCollection', path: "/collections/new", component: asyncComponent("views/new-collection"), props },
    { name: 'collections', path: "/collections", component: asyncComponent("views/collections") },
    { name: 'manageCollection', path: "/collection/:collectionId/manage", component: asyncComponent("views/collection"), props },
    { name: 'inviteUser', path: "/collection/:collectionId/invite", component: asyncComponent("views/invite"), props }
]

export const router = new VueRouter({
    routes,
    mode: "history",
    linkActiveClass: "active"
})