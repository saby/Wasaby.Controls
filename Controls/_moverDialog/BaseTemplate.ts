import Control = require('Core/Control');
import template = require('wml!Controls/_moverDialog/BaseTemplate/BaseTemplate');
import 'css!theme?Controls/_moverDialog/BaseTemplate/BaseTemplate';

/**
 * Базовый шаблон диалогового окна, используемый в списках при перемещении элементов для выбора целевой папки.
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#headerContentTemplate
 * @cfg {function|String} Контент, располагающийся между заголовком и крестиком закрытия.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#bodyContentTemplate
 * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
 */
const
    BaseTemplate = Control.extend({
        _template: template
    });

export default BaseTemplate;
