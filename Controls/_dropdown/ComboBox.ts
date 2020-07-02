import rk = require('i18n!Controls');
import {Control, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_dropdown/ComboBox/ComboBox');
import * as Utils from 'Types/util';
import prepareEmpty from 'Controls/_dropdown/Util';
import * as tmplNotify from 'Controls/Utils/tmplNotify';
import Controller from 'Controls/_dropdown/_Controller';
import BaseDropdown from 'Controls/_dropdown/BaseDropdown';
import {SyntheticEvent} from 'Vdom/Vdom';
import {ISingleSelectableOptions} from 'Controls/interface';
import {IBaseDropdownOptions} from 'Controls/_dropdown/interface/IBaseDropdown';
import {RecordSet} from 'Types/collection';
import getDropdownControllerOptions from 'Controls/_dropdown/Utils/GetDropdownControllerOptions';

interface IComboboxOptions extends IBaseDropdownOptions, ISingleSelectableOptions {
   placeholder?: string;
   value?: string;
}

const getPropValue = Utils.object.getPropertyValue.bind(Utils);

/**
 * Контрол, позволяющий выбрать значение из списка. Полный список параметров отображается при нажатии на контрол.
 *
 * @remark
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FCombobox%2FComboboxVDom">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/dropdown-menu/combobox/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_dropdown.less">переменные тем оформления dropdown</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_dropdownPopup.less">переменные тем оформления dropdownPopup</a>
 *
 * @class Controls/_dropdown/ComboBox
 * @extends Core/Control
 * @implements Controls/_interface/ISource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/_interface/IFilter
 * @implements Controls/_interface/ISingleSelectable
 * @implements Controls/interface/IDropdownEmptyText
 * @implements Controls/interface/IInputPlaceholder
 * @implements Controls/interface/IDropdown
 * @implements Controls/_interface/INavigation
 * @control
 * @public
 * @category Input
 * @author Золотова Э.Е.
 * @demo Controls-demo/Input/ComboBox/ComboBoxPG
 */

/*
 * Control that shows list of options. In the default state, the list is collapsed, showing only one choice.
 * The full list of options is displayed when you click on the control.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FCombobox%2FComboboxVDom">Demo-example</a>.
 * @class Controls/_dropdown/ComboBox
 * @extends Core/Control
 * @implements Controls/_interface/ISource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/_interface/IFilter
 * @implements Controls/_interface/ISingleSelectable
 * @implements Controls/interface/IDropdownEmptyText
 * @implements Controls/_input/interface/IBase
 * @implements Controls/interface/IDropdown
 * @control
 * @public
 * @category Input
 * @author Золотова Э.Е.
 * @demo Controls-demo/Input/ComboBox/ComboBoxPG
 */

/**
 * @event Controls/_dropdown/ComboBox#valueChanged Происходит при изменении отображаемого значения контрола.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} value Отображаемое значение контрола.
 * @remark
 * Событие используется в качестве реакции на изменения, вносимые пользователем.
 * @example
 * WML:
 * <pre>
 *     <Controls.dropdown:ComboBox
 *                on:valueChanged="_valueChangedHandler()"
 *                source="{{_source}}"/>
 * </pre>
 * TS:
 *    private _valueChangedHandler(event, value) {
 *        this._text = value;
 *    }
 */

class ComboBox extends BaseDropdown {
   protected _template: TemplateFunction = template;
   protected _notifyHandler: Function = tmplNotify;

   _beforeMount(options: IComboboxOptions, recievedState: {items?: RecordSet, history?: RecordSet}): Promise<RecordSet>|void {
      this._placeholder = options.placeholder;
      this._value = options.value;
      this._setText = this._setText.bind(this);
      this._targetPoint = {
         vertical: 'bottom'
      };

      this._controller = new Controller(this._getControllerOptions(options));
      return this._controller.prepareItems(recievedState);
   }

   _beforeUpdate(options: IComboboxOptions): void {
      const containerNode = this._getContainerNode(this._container);

      if (this._width !== containerNode.offsetWidth) {
         this._width = containerNode.offsetWidth;
      }
      this._controller.update(this._getControllerOptions(options));
   }

   _getControllerOptions(options: IComboboxOptions): object {
      const controllerOptions = getDropdownControllerOptions(options);
      return { ...controllerOptions, ...{
            selectedKeys: [options.selectedKey],
            marker: false,
            popupClassName: (options.popupClassName ? options.popupClassName + ' controls-ComboBox-popup' : 'controls-ComboBox-popup')
                           + ' controls-ComboBox-popup_theme-' + options.theme,
            typeShadow: 'suggestionsContainer',
            close: this._onClose,
            open: this._onOpen,
            allowPin: false,
            selectedItemsChangedCallback: this._setText,
            theme: options.theme,
            itemPadding: {
               right: 'menu-xs',
               left: 'menu-xs'
            },
            targetPoint: this._targetPoint,
            openerControl: this
         }
      };
   }

   _selectedItemsChangedHandler(selectedItems): void {
      const key = getPropValue(selectedItems[0], this._options.keyProperty);
      this._setText(selectedItems);
      this._notify('valueChanged', [this._value]);
      this._notify('selectedKeyChanged', [key]);
   }

   _setText(selectedItems): void {
      this._isEmptyItem = getPropValue(selectedItems[0], this._options.keyProperty) === null || selectedItems[0] === null;
      if (this._isEmptyItem) {
         this._value = '';
         this._placeholder = prepareEmpty(this._options.emptyText);
      } else {
         this._value = String(getPropValue(selectedItems[0], this._options.displayProperty) || '');
         this._placeholder = this._options.placeholder;
      }
   }

   _handleMouseDown(event: SyntheticEvent): void {
      if (this._popupId) {
         this._controller.closeMenu();
      } else {
         if (!this._width) {
            this._width = this._getContainerNode(this._container).offsetWidth;
         }
         const config = {
            templateOptions: {
               width: this._width
            },
            eventHandlers: {
               onOpen: this._onOpen.bind(this),
               onClose: this._onClose.bind(this),
               onResult: this._onResult.bind(this)
            }
         };
         this._controller.setMenuPopupTarget(this._container);
         this._controller.openMenu(config).then((result) => {
            if (typeof result === 'string') {
               this._popupId = result;
            } else if (result) {
               this._selectedItemsChangedHandler(result);
            }
         });
      }
   }

   protected _onResult(action: string, data): void {
      if (action === 'itemClick') {
         const item = this._controller.getPreparedItem(data, this._options.keyProperty, this._source);
         this._selectedItemsChangedHandler([item]);
         this._controller.handleSelectedItems(item);
      }
   }

   //FIXME delete after https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
   private _getContainerNode(container:[HTMLElement]|HTMLElement): HTMLElement {
      return container[0] || container;
   }
}

ComboBox.getDefaultOptions = function () {
   return {
      placeholder: rk('Выберите') + '...'
   };
};

ComboBox._theme = ['Controls/dropdown'];

export = ComboBox;
