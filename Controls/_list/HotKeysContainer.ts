import {Control, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_list/HotKeysContainer');

/**
 * Control makes Controls.list:Container to handle up, down keys by default
 * @class Controls/_list/HotKeysContainer
 * @extends Core/Control
 * @author Шипин А.А.
 * @public
 */
class HotKeysContainer extends Control<IControlOptions> {
    protected _template: Function = template;
    protected _defaultActions = [{keyCode: 38}, {keyCode: 40}];
}

export default HotKeysContainer;
