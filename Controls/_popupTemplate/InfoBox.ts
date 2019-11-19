import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/InfoBox/InfoBox');
import Env = require('Env/Env');
import 'css!theme?Controls/popupTemplate';

/**
 * Базовый шаблон {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ всплывающей подсказки}.
 * @class Controls/_popupTemplate/InfoBox
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 */
var InfoBoxTemplate = Control.extend({
    _template: template,

    _beforeMount: function(newOptions) {
        this._setPositionSide(newOptions.stickyPosition);
    },

    _beforeUpdate: function(newOptions) {
        this._setPositionSide(newOptions.stickyPosition);
    },

    _setPositionSide: function(stickyPosition) {
        if (stickyPosition.direction.horizontal === 'left' && stickyPosition.targetPoint.horizontal === 'left') {
            this._arrowSide = 'right';
            this._arrowPosition = this._getArrowPosition(stickyPosition.direction.vertical);
        } else if (stickyPosition.direction.horizontal === 'right' && stickyPosition.targetPoint.horizontal === 'right') {
            this._arrowSide = 'left';
            this._arrowPosition = this._getArrowPosition(stickyPosition.direction.vertical);
        } else if (stickyPosition.direction.vertical === 'top' && stickyPosition.targetPoint.vertical === 'top') {
            this._arrowSide = 'bottom';
            this._arrowPosition = this._getArrowPosition(stickyPosition.direction.horizontal);
        } else if (stickyPosition.direction.vertical === 'bottom' && stickyPosition.targetPoint.vertical === 'bottom') {
            this._arrowSide = 'top';
            this._arrowPosition = this._getArrowPosition(stickyPosition.direction.horizontal);
        }
    },

    _getArrowPosition: function(side) {
        if (side === 'left' || side === 'top') {
            return 'end';
        }
        if (side === 'right' || side === 'bottom') {
            return 'start'
        }
        return 'center';
    },

    _close: function() {
       this._notify('close', [], { bubbling: true });
    }
});
/**
 * @name Controls/_popupTemplate/InfoBox#closeButtonVisibility
 * @cfg {Boolean} Устанавливает видимость кнопки для всплывающей подсказки.
 * @default true
 */
/**
 * @name Controls/_popupTemplate/InfoBox#style
 * @cfg {String} Устанавливает стиль отображения всплывающей подсказки.
 * @default secondary
 * @variant warning
 * @variant secondary
 * @variant success
 * @variant danger
 * @default secondary
 */
/**
 * @name Controls/_popupTemplate/InfoBox#stickyPosition
 * @cfg {StickyPosition} Содержит сведения о позиционировании всплывающей подсказки.
 * @remark
 * При открытии всплывающей подсказки с помощью {@link Controls/popup:Sticky}, в шаблон передаётся значение для опции stickyPosition.
 * Его рекомендуется использовать для конфигурации Controls/popupTemplate:InfoBox, что и показано в следующем примере.
 * <pre>
 * <Controls.popupTemplate:InfoBox stickyPosition="{{_options.stickyPosition}}" />
 * </pre>
 * Значение опции задавать вручную не нужно.
 */
/**
 * @typedef {Object} StickyPosition
 * @description Позиционирование всплывающей подсказки.
 * @property {TargetPoint} targetPoint Точка позиционирования относительно вызывающего элемента.
 * @property {Direction} direction Выравнивание относительно точки позиционирования.
 */

/**
 * @typedef {Object} TargetPoint
 * @description Точка позиционирования всплывающей подсказки относительно вызывающего элемента.
 * @property {String} vertical Выравнивание по вертикали.
 * Доступные значения: top, bottom.
 * @property {String} horizontal Выравнивание по горизонтали.
 * Доступные значения: right, left.
 */

/**
 * @typedef {Object} Direction
 * @description Выравнивание всплывающей подсказки относительно точки позиционирования.
 * @property {String} vertical Выравнивание по вертикали.
 * Доступные значения: top, bottom.
 * @property {String} horizontal Выравнивание по горизонтали.
 * Доступные значения: right, left.
 */

InfoBoxTemplate.getDefaultOptions = function() {
    return {
        closeButtonVisibility: true,
        styleType: 'marker',
        style: 'default'
    };
};

export = InfoBoxTemplate;
