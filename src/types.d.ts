declare module "text!*" {
    const text: string;
    export = text;
}

declare module "text!*!strip" {
    const text: string;
    export = text;
}

declare module "highlight-js" {
    import hljs from "highlight.js";
    export default hljs;
}
