import {Control, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_list/HotKeysContainer');
import {constants} from 'Env/Env';

/**
 * Control makes Controls.list:Container to handle up, down keys by default
 * @class Controls/_list/HotKeysContainer
 * @extends Core/Control
 * @author Шипин А.А.
 * @public
 */
class HotKeysContainer extends Control<IControlOptions> {
    protected _template: Function = template;
    protected _defaultActions = [{keyCode: constants.key.up}, {keyCode: constants.key.down}, {keyCode: constants.key.enter}];
    // Этого кода не будет, когда добавится еще один хук жизненного цикла - "заморозка".
    private _afterMount(): void {
        this._notify('registerKeyHook', [this], { bubbling: true});
    }
    private _beforeUnmount(): void {
        this._notify('unregisterKeyHook', [this], { bubbling: true});
    }
    register(): void {
        this._children.KeyHook.register();
    }
    unregister(): void {
        this._children.KeyHook.unregister();
    }
}

export default HotKeysContainer;
