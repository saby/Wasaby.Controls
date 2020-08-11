import {detection} from 'Env/Env';

const constants = 'Controls/Utils/FontWidthConstants/';

export const getFontWidth = (text, size) => {
    let browser;
    if (detection.chrome) {
        browser = 'Chrome';
    } else if (detection.firefox) {
        browser = 'FF';
    } else if (detection.safari) {
        browser = 'Safari';
    } else if (detection.isIE) {
        browser = 'IE';
    }

    return loadFontWidthConstants(browser).then((fonts) => countTextWidth(text, fonts, size));
};

const countTextWidth = (text, font, size) => {
    const textArray = text.split('');
    let textWidth = 0;
    for (let i = 0; i < textArray.length; i++) {
        textWidth += Number(font[size][textArray[i]]);
    }
    return textWidth;
};

const loadFontWidthConstants = (browser) => {
    let promiseResolver;
    const module = constants + browser;
    const promise = new Promise((resolve) => {
        promiseResolver = resolve;
    });
    if (requirejs.defined(module)) {
        promiseResolver(import(module).then((constant) => {
            return constant[browser];
        }));
    } else {
        import(module).then((constant) => {
            promiseResolver(constant[browser]);
        });
    }
    return promise;
};
