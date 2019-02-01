/// <amd-module name="Controls/_error/Container" />
import Control from 'Controls/_error/types/Control';
// @ts-ignore
import * as tmpl from 'wml!Controls/_error/Container';
import Dialog from 'Controls/_error/template/Dialog';
import Controller from 'Controls/_error/Controller';
import { HandlerConfig } from 'Controls/_error/types/Handler';
import DisplayOptions from 'Controls/_error/types/DisplayOptions';
import Mode from 'Controls/_error/Mode';
import 'css!Controls/_error/Container';

type Children = {
    controller: Controller
}

/**
 * Component for error displaying
 * @class
 * @name Controls/_error/Container
 * @public
 * @author Zalyaev A.V
 * @example
 * Template:
 * <pre>
 *     <Controls.error:Container
 *         name="errorContainer"
 *     />
 * </pre>
 * <pre>
 *     let errorContainer = this._children.errorContainer;
 *     this.load().catch((error) => {
 *         errorContainer.process(error)
 *     });
 * </pre>
 */
export default class Container extends Control {
    protected _template = tmpl;
    protected _children: Children;
    private __error: DisplayOptions;

    /**
     * Start error processing
     * @method
     * @name Controls/_error/Container#process
     * @public
     * @param {Error | Controls/_error/types/HandlerConfig} config
     * @void
     */
    process<T extends Error = Error>(config: HandlerConfig<T> | T) {
        let displayOptions = this.getController().process(config);
        if (!displayOptions) {
            return;
        }
        return this.__showError(displayOptions);
    }

    /**
     * Hide error template
     * @method
     * @name Controls/_error/Container#hide
     * @public
     * @void
     */
    hide() {
        if (this.__error) {
            this.__error = null;
            // @ts-ignore
            this._forceUpdate();
        }
        // @ts-ignore
        if (this._children.dialog.isOpened()) {
            // @ts-ignore
            this._children.dialog.close()
        }
    }

    /**
     * Get error-controller component
     * @method
     * @name Controls/_error/Container#getController
     * @public
     * @return {Controls/_error/Controller}
     */
    getController(): Controller {
        return this._children.controller;
    }

    protected _beforeMount(options) {
        if (!options.controller) {
            options.controller = Controller;
        }
    }

    /**
     * @method
     * @name Controls/_error/Container#__showError
     * @private
     * @param {Controls/_error/types/DisplayOptions} config
     */
    private __showError(config: DisplayOptions) {
        // диалоговое с ошибкой
        if (config.mode == Mode.dialog) {
            return this.__showModal(config);
        }
        // отрисовка внутри компонента
        this.__error = config;
        // @ts-ignore
        this._forceUpdate();
    }

    /**
     * @method
     * @name Controls/_error/Container#__showModal
     * @private
     * @param {Controls/_error/types/DisplayOptions} options
     */
    private __showModal({ template, options }: DisplayOptions) {
        // @ts-ignore
        this._children.dialog.open({
            template: Dialog,
            templateOptions: {
                template,
                templateOptions: options
            },
        });
    }
}
