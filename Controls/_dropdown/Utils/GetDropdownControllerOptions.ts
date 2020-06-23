import {IDropdownControllerOptions} from 'Controls/_dropdown/interface/IDropdownController';

function getDropdownControllerOptions(options: IDropdownControllerOptions): IDropdownControllerOptions {
    let baseConfig = {...options};
    const ignoreOptions = [
        'buttonStyle',
        'contrastBackground',
        'fontColorStyle',
        'fontSize',
        'inlineHeight',
        'emptyTemplate',
        'tooltip',
        'placeholder'
    ];

    for (let i = 0; i < ignoreOptions.length; i++) {
        const option = ignoreOptions[i];
        if (options[option] !== undefined) {
            delete baseConfig[option];
        }
    }
    return baseConfig;
}

export {
    getDropdownControllerOptions
};
