/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('js!SBIS3.CONTROLS.SelectorButton',
    [
       'html!SBIS3.CONTROLS.SelectorButton',
       'js!SBIS3.CONTROLS.ButtonBase',
       'js!SBIS3.CONTROLS.DSMixin',
       'js!SBIS3.CONTROLS.MultiSelectable',
       'js!SBIS3.CONTROLS.ActiveMultiSelectable',
       'js!SBIS3.CONTROLS.Selectable',
       'js!SBIS3.CONTROLS.ActiveSelectable',
       'js!SBIS3.CONTROLS.SyncSelectionMixin',
       'js!SBIS3.CONTROLS.ChooserMixin',
       'js!SBIS3.CONTROLS.IconMixin',
       'js!SBIS3.CONTROLS.Utils.Sanitize'
    ],
    function(dotTplFn, ButtonBase, DSMixin, MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ChooserMixin, IconMixin, Sanitize) {

   'use strict';

   /**
    * Контрол, отображающий выбранные записи в виде текстовых значений через запятую.
    * @class SBIS3.CONTROLS.SelectorButton
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @category Buttons
    * @mixes SBIS3.CONTROLS.IconMixin
    * @mixes SBIS3.CONTROLS.Clickable
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @mixes SBIS3.CONTROLS.ActiveMultiSelectable
    * @mixes SBIS3.CONTROLS.Selectable
    * @mixes SBIS3.CONTROLS.ActiveSelectable
    * @mixes SBIS3.CONTROLS.SyncSelectionMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    *
    * @cssModifier controls-SelectorButton__asLink Отображает текст как ссылку.
    */

   var SelectorButton = ButtonBase.extend([DSMixin, MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ChooserMixin, IconMixin], /** @lends SBIS3.CONTROLS.SelectorButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
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
      },

      _checkWidth: function() {
         // Хак для старых ие
         if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9 || $ws._const.browser.isIE10) {
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

      _chooseCallback: function(result) {
         if(result && result.length) {
            $ws.helpers.instanceOfModule(result[0], 'WS.Data/Entity/Model') ?
                this.addSelectedItems(result) :
                this.addItemsSelection(result);
         }
      },

      _redraw: $ws.helpers.nop
   });

   return SelectorButton;

});