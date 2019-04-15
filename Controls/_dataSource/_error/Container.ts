/// <amd-module name="Controls/_dataSource/_error/Container" />
import Control = require('Core/Control');
import template = require('wml!Controls/_dataSource/_error/Container');
// @ts-ignore
import { constants } from 'Env/Env';
import { ViewConfig } from 'Controls/_dataSource/_error/Handler';
import { Dialog } from 'Controls/popup';
import Mode from 'Controls/_dataSource/_error/Mode';

type Options = {
    /**
     * @cfg {Controls/_dataSource/_error/ViewConfig} viewConfig
     */
    viewConfig?: ViewConfig;
}

type Config = ViewConfig & {
    isShowed?: boolean;
}

/**
 * Component to display a parking error template
 * @class Controls/_dataSource/_error/Container
 * @extends Core/Control
 *
 */
export default class Container extends Control {
    private __viewConfig: Config;
    // @ts-ignore
    private __opener: Dialog;
    protected _template = template;
    hide() {
        let mode = this.__viewConfig.mode;
        this.__viewConfig = null;
        if (mode == Mode.dialog) {
            this.__hideDialog();
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
    protected destroy() {
        if (this.__opener) {
            this.__opener.destroy();
        }
        super.destroy();
    }
    protected _beforeMount(options: Options) {
        this.__updateConfig(options);
    }
    protected _beforeUpdate(options: Options) {
        this.__updateConfig(options);
    }
    protected _afterMount() {
        this.__createOpener();
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
            constants.isBrowserPlatform && !this.__opener
        ) {
            return;
        }
        this.__opener.open({
            template: config.template,
            templateOptions: config.options
        });
        config.isShowed = true;
    }
    private __hideDialog() {
        if (
            constants.isBrowserPlatform &&
            this.__opener &&
            this.__opener.isOpened()
        ) {
            this.__opener.close();
        }
    }
    private __updateConfig(options: Options) {
        this.__viewConfig = options.viewConfig;
        if (this.__viewConfig) {
            this.__viewConfig.isShowed = this.__viewConfig.mode !== Mode.dialog;
        }
    }
    private __createOpener() {
        if (!this.__opener) {
            /*
             * Надо для того чтобы не "портить" вёрстку своим оборачивающим div
             * Убрать после закрытия задачи:
             * https://online.sbis.ru/opendoc.html?guid=2a0f76a4-8b69-403a-ae5f-1af4f0443fe6
             */
            this.__opener = Control.createControl(Dialog, {}, this._container);
        }
    }
}
