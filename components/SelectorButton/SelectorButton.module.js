/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('js!SBIS3.CONTROLS.SelectorButton',
    [
   "Core/constants",
   "html!SBIS3.CONTROLS.SelectorButton",
   "js!SBIS3.CONTROLS.ButtonBase",
   "js!SBIS3.CONTROLS.DSMixin",
   "js!SBIS3.CONTROLS.MultiSelectable",
   "js!SBIS3.CONTROLS.ActiveMultiSelectable",
   "js!SBIS3.CONTROLS.Selectable",
   "js!SBIS3.CONTROLS.ActiveSelectable",
   "js!SBIS3.CONTROLS.SyncSelectionMixin",
   "js!SBIS3.CONTROLS.ChooserMixin",
   "js!SBIS3.CONTROLS.IconMixin",
   "Core/Sanitize",
   "Core/core-instance",
   "Core/helpers/functional-helpers",
   "Core/helpers/collection-helpers"
],
    function( constants, dotTplFn, ButtonBase, DSMixin, MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ChooserMixin, IconMixin, Sanitize, cInstance, fHelpers, colHelpers) {

   'use strict';

    /* Функция рендера текста в шаблоне компонента */
    function itemTemplateRender(opts) {
       var items = [],
           res = [];

       if(opts.selectedItem && cInstance.instanceOfModule(opts.selectedItem, 'WS.Data/Entity/Model')) {
          items = [opts.selectedItem];
       } else if (opts.selectedItems) {
          items = opts.selectedItems.toArray();
       }

       if(items.length) {
          colHelpers.forEach(items, function(item) {
             res.push(item.get(opts.displayField));
          })
       }

       return res.join('');
    }

   /**
    * Контрол, отображающий выбранные записи в виде текстовых значений через запятую.
    * @class SBIS3.CONTROLS.SelectorButton
    * @extends SBIS3.CONTROLS.ButtonBase
    * @author Крайнов Дмитрий Олегович
    * @mixes SBIS3.CONTROLS.IconMixin
    * @mixes SBIS3.CONTROLS.Clickable
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @mixes SBIS3.CONTROLS.ActiveMultiSelectable
    * @mixes SBIS3.CONTROLS.Selectable
    * @mixes SBIS3.CONTROLS.ActiveSelectable
    * @mixes SBIS3.CONTROLS.SyncSelectionMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @cssModifier controls-SelectorButton__asLink Отображает текст как ссылку.
    *
    * @category Buttons
    * @control
    * @public
    */

   var SelectorButton = ButtonBase.extend([DSMixin, MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ChooserMixin, IconMixin], /** @lends SBIS3.CONTROLS.SelectorButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            _preRender: itemTemplateRender,
            /**
             * @cfg {String}  Текст на кнопке по-умолчанию, проставляется если нет выбранных элементов
             * @example
             * <pre class="brush:xml">
             *     <option name="defaultCaption">Сохранить</option>
             * </pre>
             */
            defaultCaption: '',
            /**
             * @typedef {Array} dictionaries
             * @property {String} caption Текст в меню.
             * @property {String} template Шаблон, который отобразится в диалоге выбора.
             * @property {Object} componentsOptions Опции, которые прокинутся в компонент на диалоге выбора.
             * @translatable caption
             */
            /**
             * @cfg {dictionaries[]} Набор диалогов выбора для поля связи
             * @remark
             * Если передать всего один элемент, то дилог выбора откроется при клике на иконку меню.
             */
            dictionaries: []
         },
         _text: null
      },
      _drawSelectedItems: function(keysArr) {
         var self = this,
             isSelected = !this._isEmptySelection();

         $('.controls-SelectorButton__cross', this._container[0]).toggleClass('ws-hidden', !isSelected);
         if(isSelected) {
            var linkTextArray = [];

            this.getSelectedItems(true).addCallback(function(list){
               list.each(function(item) {
                  linkTextArray.push(item.get(self._options.displayField));
               });
               self._setCaption(linkTextArray.join(', '));
               return list;
            });
         } else {
            this._setCaption(this._options.defaultCaption);
         }
      },

      /**
       * Для кнопки выбора требуется своя реализация метода setSelectedKey, т.к.
       * Selectable расчитывает на наличие проекции и items, которых в кнопке выбора нет.
       * + кнопке выбора не требуется единичная отрисовка item'a, т.к. при синхронизации selectedKey и selectedKeys,
       * всегда будет вызываться метод drawSelectedItems
       *
       * Когда сделаем контроллеры и интерфесы, этот метод просто будет звать метод контроллера
       * @param key
       */
      setSelectedKey: function(key) {
         this._options.selectedKey = key;
         this._notifySelectedItem(this._options.selectedKey);
      },

      setCaption: function(caption) {
         throw new Error('SelectorButton::setCaption св-во caption работает только на чтение');
      },

      _setCaption: function(caption) {
         var btnCaption = caption || this._options.defaultCaption,
             text = this._container.find('.controls-SelectorButton__text'),
             resultText = Sanitize(caption);

         SelectorButton.superclass.setCaption.call(this, btnCaption);
         text.html(resultText);
         /* Скрываем, если текст пустой */
         text.toggleClass('ws-hidden', !resultText);
         this._checkWidth();
         this._notifyOnSizeChanged();
      },

      _checkWidth: function() {
         // Хак для старых ие
         if (constants.browser.isIE8 || constants.browser.isIE9 || constants.browser.isIE10) {
            if(!this.isVisibleWithParents()) {
               return;
            }

            var additionalWidth = this._container.find('.controls-SelectorButton__icon:visible').width() + this._container.find('.controls-SelectorButton__cross:visible').width(),
                text = this._container.find('.controls-SelectorButton__text'),
                containerWidth = this._container.width(),
                resultWidth;

            if (containerWidth < (additionalWidth + text.width())) {
               resultWidth = containerWidth - additionalWidth;
               if(resultWidth > 0) {
                  text.width(containerWidth - additionalWidth);
               }
            } else {
               text.width('auto');
            }
         }
      },

      _onResizeHandler: function() {
         SelectorButton.superclass._onResizeHandler.apply(this, arguments);
         this._checkWidth();
      },

      _clickHandler: function(e) {
         if($(e.target).hasClass('controls-SelectorButton__cross')) {
            this.removeItemsSelectionAll();
            //люди биндятся на опцию selectedItem. И при сбросе значения на крестик, selectedItem тоже должен сбрасываться.
            this.setSelectedKey(null);
         } else {
            //TODO Пока делаю выбор из одного справочника, в дальнейшем доработать выбор из нескольких
            var dic = this._options.dictionaries[0];
            this._showChooser(
                dic && dic.template,
                dic && dic.componentOptions
            )
         }
      },

      /**
       * Установить набор диалогов выбора для поля связи
       * @param {Array} dictionaries Набор диалогов выбора для поля связи
       */
      setDictionaries: function (dictionaries) {
         this._options.dictionaries = dictionaries;
      },

      /**
       * Получить набор диалогов выбора для поля связи
       * @returns {Array} Набор диалогов выбора для поля связи
       */
      getDictionaries: function () {
         return this._options.dictionaries;
      },

      _chooseCallback: function(result) {
         if(result && result.length) {
            cInstance.instanceOfModule(result[0], 'WS.Data/Entity/Model') ?
                this.addSelectedItems(result) :
                this.addItemsSelection(result);
         }
      },

      _getAdditionalChooserConfig: function() {
         return {
            multiSelect: this.getMultiselect()
         }
      },

      _redraw: fHelpers.nop
   });

   return SelectorButton;

});