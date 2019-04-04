/// <amd-module name="Controls/_dataSource/_error/Container" />
import Control = require('Core/Control');
import template = require('wml!Controls/_dataSource/_error/Container');
// @ts-ignore
import { constants } from 'Env/Env';
import { ViewConfig } from 'Controls/_dataSource/_error/Handler';
import Mode from 'Controls/_dataSource/_error/Mode';
import 'css!Controls/_dataSource/_error/Container';

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
            constants.isBrowserPlatform && !this._children.dialogOpener
        ) {
            return;
        }
        this._children.dialogOpener.open({
            template: config.template,
            templateOptions: config.options
        });
        config.isShowed = true;
    }
    private __hideDialog() {
        if (
            constants.isBrowserPlatform &&
            this._children.dialogOpener &&
            this._children.dialogOpener.isOpened()
        ) {
            this._children.dialogOpener.close();
        }
    }
    private __updateConfig(options: Options) {
        this.__viewConfig = options.viewConfig;
        if (this.__viewConfig) {
            this.__viewConfig.isShowed = this.__viewConfig.mode !== Mode.dialog;
        }
    }
}
