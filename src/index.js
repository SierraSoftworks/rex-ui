require.config({
    paths: {
        "vue-class-component": "https://cdn.jsdelivr.net/npm/vue-class-component@7.1.0/dist/vue-class-component.min",
        "highlight-js": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min",
        "markdown-it": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
    },
    map: {
        "*": {

        }
    },
    packages: [
        {
            name: "vue-module",
            location: "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10",
            main: "vue"
        },
        {
            name: "vue-router-module",
            location: "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.1.3",
            main: "vue-router"
        },
        {
            name: "vuex",
            location: "https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1",
            main: "vuex"
        },
        {
            name: "dayjs",
            location: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.16",
            main: "dayjs.min"
        },
        {
            name: "ELEMENT",
            location: "https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.12.0",
            main: "index"
        },
        {
            name: "Msal",
            location: "https://alcdn.msauth.net/lib/1.1.3/js",
            main: "msal"
        },
        {
            name: "spark-md5",
            location: "https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.0",
            main: "spark-md5.min"
        }
    ],
    shim: {
        "ELEMENT": {
            deps: ["vue"]
        }
    },
    deps: [
        "vue-module",
        "vue-router-module",
        "vuex"
    ],
    callback: () => {
        requirejs(["vue", "ELEMENT", "ELEMENT/locale/en"], (Vue, ElementUI, locale) => {
            Vue.use(ElementUI, { locale })

            requirejs(["app"], function (app) { })
        })
    }
})

define("vue", ["vue-module"], (Vue) => {
    Vue.default = Vue
    return Vue
})

define("msal", ["Msal"], (msal) => msal)

define("vue-router", ["vue-router-module"], (VueRouter) => {
    VueRouter.default = VueRouter
    return VueRouter
})
