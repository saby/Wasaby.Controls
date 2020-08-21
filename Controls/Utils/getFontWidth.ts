import {detection} from 'Env/Env';

const constants = 'Controls/Utils/FontWidthConstants/';
const fontSizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

export const getFontWidth = (text) => {
    let browser = 'Chrome';
    if (detection.firefox) {
        browser = 'FF';
    } else if (detection.safari) {
        browser = 'Safari';
    } else if (detection.isIE) {
        browser = 'IE';
    }

    return loadFontWidthConstants(browser).then((fonts) => countTextWidth(text, fonts));
};

const countTextWidth = (text, fonts) => {
    const allSizesTextWidth = {};
    for (const fontSize of fontSizes) {
        let textWidth = 0;
        for (const symbol of text) {
            textWidth += fonts[fontSize][symbol];
        }
        allSizesTextWidth[fontSize] = textWidth;
    }
    return allSizesTextWidth;
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
