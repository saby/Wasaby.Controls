const IE = 'Controls/Utils/FontWidthConstants/IE';
const FF = 'Controls/Utils/FontWidthConstants/FF';
const SAFARI = 'Controls/Utils/FontWidthConstants/Safari';
const CHROME = 'Controls/Utils/FontWidthConstants/Chrome';

const loadFontWidthConstants = (module: string) => {
    let promiseResolver;
    const promise = new Promise((resolve) => {
        promiseResolver = resolve;
    });
    if (requirejs.defined(module)) {
        promiseResolver(requirejs(module));
    } else {
        requirejs([module], (loadedModule) => {
            promiseResolver(loadedModule);
        });
    }
    return promise;
};

export const getFontWidthConstants = (browser) => {
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
        case 'Safari': {
            module = SAFARI;
            break;
        }
        case 'Chrome': {
            module = CHROME;
            break;
        }
        default: {
            module = CHROME;
            break;
        }
    }
    return loadFontWidthConstants(module);
};
