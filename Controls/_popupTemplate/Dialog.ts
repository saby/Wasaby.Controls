import Control = require('Core/Control');
import template = require('wml!Controls/_popupTemplate/Dialog/Dialog');
import Env = require('Env/Env');
import { goUpByControlTree } from 'UI/Focus';
import {Controller as ManagerController} from 'Controls/popup';

const prepareCloseButton = {
    light: 'link',
    popup: 'popup',
    default: 'toolButton',
    primary: 'toolButton',
    toolButton: 'toolButton',
    link: 'link'
};
const DialogTemplate = Control.extend({

    /**
     * Базовый шаблон {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#template диалогового окна}.
     * @class Controls/_popupTemplate/Dialog
     * @extends Core/Control
     * @control
     * @public
     * @category Popup
     * @author Красильников А.С.
     * @demo Controls-demo/Popup/Templates/DialogTemplatePG
     */

    /*
     * Layout of the dialog template. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/dialog/#template Read more}.
     * @class Controls/_popupTemplate/Dialog
     * @extends Core/Control
     * @control
     * @public
     * @category Popup
     * @author Красильников А.С.
     * @demo Controls-demo/Popup/Templates/DialogTemplatePG
     */

    /**
     * @name Controls/_popupTemplate/Dialog#headingCaption
     * @cfg {String} Заголовок диалогового окна.
     */
    /*
     * @name Controls/_popupTemplate/Dialog#headingCaption
     * @cfg {String} Header title.
     */

    /**
     * @name Controls/_popupTemplate/Dialog#headingStyle
     * @cfg {String} Стиль отображения заголовка диалогового окна.
     * @variant secondary
     * @variant primary
     * @variant info
     */
    /*
     * @name Controls/_popupTemplate/Dialog#headingStyle
     * @cfg {String} Caption display style.
     * @variant secondary
     * @variant primary
     * @variant info
     */

    /**
     * @name Controls/_popupTemplate/Dialog#headerContentTemplate
     * @cfg {function|String} Контент, отображаемый между заголовком и кнопкой, закрывающей окно.
     */
    /*
     * @name Controls/_popupTemplate/Dialog#headerContentTemplate
     * @cfg {function|String} The content between the header and the cross closure.
     */

    /**
     * @name Controls/_popupTemplate/Dialog#bodyContentTemplate
     * @cfg {function|String} Основной контент диалогового окна.
     */
    /*
     * @name Controls/_popupTemplate/Dialog#bodyContentTemplate
     * @cfg {function|String} Main content.
     */

    /**
     * @name Controls/_popupTemplate/Dialog#footerContentTemplate
     * @cfg {function|String} Контент футера диалогового окна.
     */
    /*
     * @name Controls/_popupTemplate/Dialog#footerContentTemplate
     * @cfg {function|String} Content at the bottom of the stack panel.
     */

    /**
     * @name Controls/_popupTemplate/Dialog#closeButtonVisibility
     * @cfg {Boolean} Устанавливает видимость кнопки, закрывающей окно.
     */
    /*
     * @name Controls/_popupTemplate/Dialog#closeButtonVisibility
     * @cfg {Boolean} Determines whether display of the close button.
     */

    /**
     * @name Controls/_popupTemplate/Dialog#closeButtonViewMode
     * @cfg {String} Устанавливает стиль отображения кнопки, закрывающей окно.
     * @variant toolButton
     * @variant link
     * @variant popup
     * @default popup
     */
    /*
     * @name Controls/_popupTemplate/Dialog#closeButtonViewMode
     * @cfg {String} Close button display style.
     * @variant toolButton
     * @variant link
     * @variant popup
     * @default popup
     */

    /**
     * @name Controls/_popupTemplate/Dialog#closeButtonTransparent
     * @cfg {String} Устанавливает прозрачность фона закрывающей кнопки.
     * @variant true
     * @variant false
     * @default true
     */
    /*
     * @name Controls/_popupTemplate/Dialog#closeButtonTransparent
     * @cfg {String} Close button transparent.
     * @variant true
     * @variant false
     * @default true
     */

    /**
     * @name Controls/_popupTemplate/Dialog#draggable
     * @cfg {Boolean} Определяет, может ли окно перемещаться с помощью <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/tools/drag-n-drop/'>d'n'd</a>.
     * @default false
     */
    /*
     * @name Controls/_popupTemplate/Dialog#draggable
     * @cfg {Boolean} Determines whether the control can be moved by d'n'd.
     * @default false
     */

         _template: template,
         _closeButtonVisibility: true,
         _closeButtonViewMode: 'popup',
         _beforeMount: function(options) {
             this._prepareTheme();
         },
         _beforeUpdate: function(options) {
             this._prepareTheme();
         },
          _prepareTheme(): void {
              this._headerTheme = ManagerController.getPopupHeaderTheme();
          },
         /**
          * Закрытие всплывающего диалогового окна.
          * @function Controls/_popupTemplate/Dialog#close
          */
         /*
          * Close popup.
          * @function Controls/_popupTemplate/Dialog#close
          */
         close: function() {
            this._notify('close', [], { bubbling: true });
         },

         _onMouseDown(event) {
            if (this._needStartDrag(event.target)) {
               this._startDragNDrop(event)
            }
         },

    _startDragNDrop(event) {
        this._children.dragNDrop.startDragNDrop(null, event);
    },

    _needStartDrag(target) {
        const controlsArray = goUpByControlTree(target);

        // if click to control then control must handle click
        return this._options.draggable && controlsArray[0]._container === this._container;
    },

    _onDragEnd() {
        this._notify('popupDragEnd', [], {bubbling: true});
    },

    _onDragMove(event, dragObject) {
        this._notify('popupDragStart', [dragObject.offset], {bubbling: true});
    }
});
DialogTemplate.getDefaultOptions = function() {
    return {
        headingStyle: 'secondary',
        headingSize: '3xl',
        closeButtonVisibility: true,
        closeButtonViewMode: 'popup',
        closeButtonTransparent: true
    };
};
DialogTemplate._theme = ['Controls/popupTemplate'];

export = DialogTemplate;
