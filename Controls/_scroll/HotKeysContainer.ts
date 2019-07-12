import {Control, IControlOptions} from 'UI/Base';
import template = require('wml!Controls/_scroll/HotKeysContainer');

/**
 * Control makes Controls.scroll:Container to handle up, down, page up, page down, home, end keys by default
 * @class Controls/_scroll/HotKeysContainer
 * @extends Core/Control
 * @author Шипин А.А.
 * @public
 */
class HotKeysContainer extends Control<IControlOptions> {
    protected _template: Function = template;
    protected _defaultActions = [{keyCode: 33}, {keyCode: 34}, {keyCode: 35}, {keyCode: 36}, {keyCode: 38}, {keyCode: 40}];
}

export default HotKeysContainer;
