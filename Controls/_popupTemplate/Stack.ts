import rk = require('i18n!Controls_localization');
import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Stack/Stack');
import {Controller as ManagerController} from 'Controls/popup';

const MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON = 100;

const DialogTemplate = Control.extend({

    /**
     * Базовый шаблон {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ стекового окна}.
     * @class Controls/_popupTemplate/Stack
     * @extends Core/Control
     * @control
     * @public
     * @category Popup
     * @author Красильников А.С.
     * @demo Controls-demo/Popup/Templates/StackTemplatePG
     */
    /*
     * Base template of stack panel. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#template-standart See more}.
     * @class Controls/_popupTemplate/Stack
     * @extends Core/Control
     * @control
     * @public
     * @category Popup
     * @author Красильников А.С.
     * @demo Controls-demo/Popup/Templates/StackTemplatePG
     */

    /**
     * @name Controls/_popupTemplate/Stack#headingCaption
     * @cfg {String} Текст заголовка.
     */
    /*
     * @name Controls/_popupTemplate/Stack#headingCaption
     * @cfg {String} Header title.
     */

    /**
     * @name Controls/_popupTemplate/Stack#headingStyle
     * @cfg {String} Стиль отображения заголовка.
     * @variant secondary
     * @variant primary
     * @variant info
     */
    /*
     * @name Controls/_popupTemplate/Stack#headingStyle
     * @cfg {String} Caption display style.
     * @variant secondary
     * @variant primary
     * @variant info
     */

    /**
     * @name Controls/_popupTemplate/Stack#headingSize
     * @cfg {String} Размер заголовка
     * @variant s
     * @variant m
     * @variant l
     * @variant xl
     * @default l
     */
    /*
     * @name Controls/_popupTemplate/Stack#headingSize
     * @cfg {String} Heading size.
     * @variant s Small text size.
     * @variant m Medium text size.
     * @variant l Large text size.
     * @variant xl Extralarge text size.
     * @default l
     */

    /**
     * @name Controls/_popupTemplate/Stack#headerContentTemplate
     * @cfg {function|String} Контент, располагающийся между заголовком и крестиком закрытия.
     */
    /*
     * @name Controls/_popupTemplate/Stack#headerContentTemplate
     * @cfg {function|String} The content between the header and the cross closure.
     */

    /**
     * @name Controls/_popupTemplate/Stack#bodyContentTemplate
     * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
     */
    /*
     * @name Controls/_popupTemplate/Stack#bodyContentTemplate
     * @cfg {function|String} Main content.
     */

    /**
     * @name Controls/_popupTemplate/Stack#footerContentTemplate
     * @cfg {function|String} Контент, располагающийся в нижней части шаблона.
     */
    /*
     * @name Controls/_popupTemplate/Stack#footerContentTemplate
     * @cfg {function|String} Content at the bottom of the stack panel.
     */

    /**
     * @name Controls/_popupTemplate/Stack#closeButtonVisibility
     * @cfg {Boolean} Определяет, будет ли отображаться кнопка закрытия
     */
    /*
     * @name Controls/_popupTemplate/Stack#closeButtonVisibility
     * @cfg {Boolean} Determines whether display of the close button.
     */

    /**
     * @name Controls/_popupTemplate/Stack#maximizeButtonVisibility
     * @cfg {Boolean} Определяет, будет ли отображаться кнопка изменения размера.
     */
    /*
     * @name Controls/_popupTemplate/Stack#maximizeButtonVisibility
     * @cfg {Boolean} Determines the display maximize button.
     */

    /**
     * @name Controls/_popupTemplate/Stack#closeButtonViewMode
     * @cfg {String} Стиль отображения кнопки закрытия
     * @variant toolButton
     * @variant link
     * @variant popup
     * @default popup
     */
    /*
     * @name Controls/_popupTemplate/Stack#closeButtonViewMode
     * @cfg {String} Close button display style.
     * @variant toolButton
     * @variant link
     * @variant popup
     * @default popup
     */

    /**
     * @name Controls/_popupTemplate/Stack#closeButtonTransparent
     * @cfg {String} Определяет прозрачность фона кнопки закрытия.
     * @variant true
     * @variant false
     * @default true
     */

    /*
     * @name Controls/_popupTemplate/Stack#closeButtonTransparent
     * @cfg {String} Close button transparent.
     * @variant true
     * @variant false
     * @default true
     */

    /**
     * @name Controls/_popupTemplate/Stack#workspaceWidth
     * @cfg {Number} Текущая ширина шаблона стековой панели
     * @remark
     * Опция только для чтения, значение устанавливается контролом Controls/popup исходя из заданной конфигурации окна
     */

    _template: template,
    _maximizeButtonVisibility: false,
    _closeButtonViewMode: 'popup',
    _beforeMount(options) {
        this._maximizeButtonTitle = `${rk('Свернуть')}/${rk('Развернуть')}`;
        this._updateMaximizeButton(options);
        this._prepareTheme();
    },

    _beforeUpdate(newOptions) {
        this._updateMaximizeButton(newOptions);
        this._prepareTheme();
    },

    _afterUpdate(oldOptions) {
        if (this._options.maximized !== oldOptions.maximized) {
            this._notify('controlResize', [], {bubbling: true});
        }
    },
    _prepareTheme(): void {
        this._headerTheme = ManagerController.getPopupHeaderTheme();
    },
    _updateMaximizeButton(options) {
        if (options.stackMaxWidth - options.stackMinWidth < MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON) {
            this._maximizeButtonVisibility = false;
        } else {
            this._maximizeButtonVisibility = options.maximizeButtonVisibility;
        }
    },

    /**
     * Закрыть всплывающее окно
     * @function Controls/_popupTemplate/Stack#close
     */
    close() {
        this._notify('close', [], {bubbling: true});
    },
    changeMaximizedState() {
        /**
         * @event maximized
         * Occurs when you click the expand / collapse button of the panels.
         */
        const maximized = this._calculateMaximized(this._options);
        this._notify('maximized', [!maximized], {bubbling: true});
    },
    _calculateMaximized(options) {
        // TODO: https://online.sbis.ru/opendoc.html?guid=256679aa-fac2-4d95-8915-d25f5d59b1ca
        if (!options.stackMinimizedWidth && options.stackMinWidth && options.stackMaxWidth) {
            const middle = (options.stackMinWidth + options.stackMaxWidth) / 2;
            return options.stackWidth - middle > 0;
        }
        return options.maximized;
    }
});

DialogTemplate.getDefaultOptions = function() {
    return {
        headingStyle: 'secondary',
        closeButtonVisibility: true,
        headingSize: 'l',
        closeButtonViewMode: 'popup',
        closeButtonTransparent: true
    };
};
DialogTemplate._theme = ['Controls/popupTemplate'];
export = DialogTemplate;

/**
 * @name Controls/_popupTemplate/Stack#close
 * Close popup.
 */
