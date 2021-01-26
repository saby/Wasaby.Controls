import template = require('wml!Controls/_toggle/Tumbler/Tumbler');
import {TemplateFunction} from 'UI/Base';
import ButtonGroupBase from 'Controls/_toggle/ButtonGroupBase';

/**
 * Контрол представляет собой кнопочный переключатель. Используется, когда на странице необходимо разместить
 * неакцентный выбор из одного или нескольких параметров.
 * @class Controls/_toggle/Tumbler
 * @extends Controls/_toggle/ButtonGroupBase
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/toggle/Tumbler/Index
 */

class Tumbler extends ButtonGroupBase {
    protected _template: TemplateFunction = template;

}

export default Tumbler;
