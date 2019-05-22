/// <amd-module name="Controls/_dataSource/_error/Container" />
import Control = require('Core/Control');
import template = require('wml!Controls/_dataSource/_error/Container');
// @ts-ignore
import { constants } from 'Env/Env';
import { ViewConfig } from 'Controls/_dataSource/_error/Handler';
import Mode from 'Controls/_dataSource/_error/Mode';
// @ts-ignore
import { load } from 'Core/library';

type Options = {
    /**
     * @cfg {Controls/_dataSource/_error/ViewConfig} viewConfig
     */
    viewConfig?: ViewConfig;
}

type Config = ViewConfig & {
    isShowed?: boolean;
}
let getTemplate = (template: string | Control): Promise<Control> => {
    if (typeof template == 'string') {
        return load(template);
    }
    return Promise.resolve(template);
};

/**
 * Компонент для отображения шаблона ошибки по данным контрола {@link Controls/_dataSource/_error/Controller}
 * @class Controls/_dataSource/_error/Container
 * @extends Core/Control
 * @private
 * @author Заляев А.В.
 *
 */
export default class Container extends Control {
    private __viewConfig: Config;
    protected _template = template;
    hide() {
        let mode = this.__viewConfig.mode;
        this.__viewConfig = null;
        if (mode == Mode.dialog) {
            return;
        }
        this._forceUpdate();
    }
    show(viewConfig: ViewConfig) {
        if (viewConfig.mode == Mode.dialog) {
            return this.__showDialog(viewConfig)
        }
        this.__viewConfig = viewConfig;
        this._forceUpdate();
    }
    protected _beforeMount(options: Options) {
        this.__updateConfig(options);
    }
    protected _beforeUpdate(options: Options) {
        this.__updateConfig(options);
    }
    protected _afterMount() {
        if (this.__viewConfig) {
            this.__showDialog(this.__viewConfig);
        }
    }
    protected _afterUpdate() {
        if (this.__viewConfig) {
            this.__showDialog(this.__viewConfig);
        }
    }
    private __showDialog(config: Config) {
        if (
            config.isShowed ||
            config.mode != Mode.dialog ||
            !constants.isBrowserPlatform
        ) {
            return;
        }
        config.isShowed = true;
        getTemplate(config.template).then((template) => {
            let result: Promise<void> = this._notify('serviceError', [
                template,
                config.options
            ], { bubbling: true });
            if (result) {
                result.then(this.__notifyDialogClosed.bind(this));
            }
        });
    }
    private __notifyDialogClosed() {
        this._notify('dialogClosed', []);
    }
    private __updateConfig(options: Options) {
        this.__viewConfig = options.viewConfig;
        if (this.__viewConfig) {
            this.__viewConfig.isShowed = this.__viewConfig.isShowed || this.__viewConfig.mode !== Mode.dialog;
        }
    }
}
