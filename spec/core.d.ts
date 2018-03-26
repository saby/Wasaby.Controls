declare type HashMap<T> = {
    [propName: string]: T
};

// Сломает переходы в IDE по ctrl+click
declare module "json!*" {
    const json: object;
    export = json;
}
declare module "tmpl!*" {
    const tmpl: (...args: Array<any>) => string;
    export = tmpl;
}

declare let rk: (key: string, ctx?: string | number, num?: number) => string;
