import {detection} from 'Env/Env';

const IE = 'Controls/Utils/FontWidthConstants/IE';
const FF = 'Controls/Utils/FontWidthConstants/FF';
const SAFARI = 'Controls/Utils/FontWidthConstants/Safari';
const CHROME = 'Controls/Utils/FontWidthConstants/Chrome';

export const getFontWidth = (text, size) => {
    let browser;
    let module;
    if (detection.chrome) {
        module = CHROME;
        browser = 'CHROME';
    } else if (detection.firefox) {
        module = FF;
        browser = 'FF';
    } else if (detection.safari) {
        module = SAFARI;
        browser = 'SAFARI';
    } else if (detection.isIE) {
        module = IE;
        browser = 'IE';
    }

    return loadFontWidthConstants(module, browser).then((fonts) => countTextWidth(text, fonts, size));
};

const countTextWidth = (text, font, size) => {
    const textArray = text.split('');
    let textWidth = 0;
    for (let i = 0; i < textArray.length; i++) {
        textWidth += Number(font[size][textArray[i]]);
    }
    return textWidth;
};

const loadFontWidthConstants = (module, moduleName) => {
    let promiseResolver;
    const promise = new Promise((resolve) => {
        promiseResolver = resolve;
    });
    if (requirejs.defined(module)) {
        promiseResolver(import(module).then((constants) => {
            return constants[moduleName];
        }));
    } else {
        import(module).then((constants) => {
            promiseResolver(constants[moduleName]);
        });
    }
    return promise;
};
