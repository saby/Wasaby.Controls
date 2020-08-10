import {detection} from 'Env/Env';

const IE = 'Controls/Utils/FontWidthConstants/IE';
const FF = 'Controls/Utils/FontWidthConstants/FF';
const SAFARI = 'Controls/Utils/FontWidthConstants/Safari';
const CHROME = 'Controls/Utils/FontWidthConstants/Chrome';

export const getFontWidth = (text, size) => {
    let browser;
    if (detection.chrome) {
        browser = 'CHROME';
    } else if (detection.firefox) {
        browser = 'FF';
    } else if (detection.safari) {
        browser = 'SAFARI';
    } else if (detection.isIE) {
        browser = 'IE';
    }

    return getFontWidthConstant(browser).then((fonts) => countTextWidth(text, fonts, size));
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

const getFontWidthConstant = (browser) => {
    let module;
    switch (browser) {
        case 'IE': {
            module = IE;
            break;
        }
        case 'FF': {
            module = FF;
            break;
        }
        case 'SAFARI': {
            module = SAFARI;
            break;
        }
        case 'CHROME': {
            module = CHROME;
            break;
        }
        default: {
            module = CHROME;
            break;
        }
    }
    return loadFontWidthConstants(module, browser);
};
