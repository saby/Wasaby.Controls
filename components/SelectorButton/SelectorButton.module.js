/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('js!SBIS3.CONTROLS.SelectorButton',
    [
   "Core/constants",
   "html!SBIS3.CONTROLS.SelectorButton",
   "js!WSControls/Buttons/ButtonBase",
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
   "Core/helpers/collection-helpers",
   'Core/helpers/string-helpers',
   'js!SBIS3.CONTROLS.ToSourceModel',
   'js!SBIS3.CONTROLS.Utils.ItemsSelection',
   'js!SBIS3.CONTROLS.Action.SelectorAction',
   'css!SBIS3.CONTROLS.SelectorButton'
],
    function(
       constants,
       dotTplFn,
       WSButtonBase,
       DSMixin,
       MultiSelectable,
       ActiveMultiSelectable,
       Selectable,
       ActiveSelectable,
       SyncSelectionMixin,
       ChooserMixin,
       IconMixin,
       Sanitize,
       cInstance,
       fHelpers,
       colHelpers,
       strHelpers,
       ToSourceModel,
       ItemsSelectionUtil
    ) {

   'use strict';

    /* Функция рендера текста в шаблоне компонента */
    function itemTemplateRender(opts) {
       var res = [],
          items;

       if(opts.selectedItem && cInstance.instanceOfModule(opts.selectedItem, 'WS.Data/Entity/Model')) {
          items = [opts.selectedItem];
       } else if (opts.selectedItems) {
          items = opts.selectedItems;
       }

       if (items) {
          items.forEach(function(item) {
             res.push(item.get(opts.displayProperty));
          });
       }

       return res.join('');
    }

   /**
    * Класса контрола "Кнопка выбора", который отображает выбранные записи в виде текстовых значений через запятую.
    * Контрол применяется в качестве альтернативы полю связи {@link SBIS3.CONTROLS.FieldLink}.
    *
    * Подробнее о поле связи и кнопке выбора вы можете прочитать в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/textbox/field-link/'>Поле связи</a>.
    *
    * @class SBIS3.CONTROLS.SelectorButton
    * @extends SBIS3.CONTROLS.WSButtonBase
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @mixes SBIS3.CONTROLS.IconMixin
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @mixes SBIS3.CONTROLS.ActiveMultiSelectable
    * @mixes SBIS3.CONTROLS.Selectable
    * @mixes SBIS3.CONTROLS.ActiveSelectable
    * @mixes SBIS3.CONTROLS.SyncSelectionMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    *
    * @cssModifier controls-SelectorButton__asLink Отображает текст как ссылку.
    * @cssModifier controls-SelectorButton__withoutCross Скрывает крестик справа от текста.
    *
    * @demo SBIS3.DOCS.SelectorButtonLink Пример 1. Кнопка выбора в виде иконки, поле ввода отсутствует. Вызов справочника производится кликом по кнопке с иконкой. Все выбранные значения будут отображаться справа от кнопки.
    * В режиме множественного выбора сброс выбранных значений производится массово кликом по серому крестику.
    * @demo SBIS3.DOCS.SelectorButtonSingle Пример 2. Кнопка выбора в виде кнопки-ссылки, поле ввода отсутствует. Вызов справочника производится кликом по ссылке. Все выбранные значения будут отображаться в качестве текста кнопки.
    * В режиме множественного выбора удаление выбранных значений производится массово кликом по серому крестику. Для корректного отображения кнопки-ссылки используется CSS-модификатор "controls-SelectorButton__asLink".
    *
    * @category Buttons
    * @control
    * @public
    */

   var SelectorButton = WSButtonBase.extend([DSMixin, MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ChooserMixin, IconMixin], /** @lends SBIS3.CONTROLS.SelectorButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            clickThrottle: true,
            _preRender: itemTemplateRender,
            /**
             * @cfg {String} Устанавливает текст на кнопке выбора, который будет отображен, если нет выбранных элементов.
             * @example
             * <pre class="brush:xml">
             *     <option name="defaultCaption">Сотрудники</option>
             * </pre>
             */
            defaultCaption: '',
            /**
             * @typedef {Array} dictionaries
             * @property {String} caption Название, которое будет использовано в меню выбора справочника. Опция неактуальна, когда установлен только один справочник.
             * @property {String} template Шаблон справочника. В качестве значения передают имя компонента.
             * @property {Object} componentsOptions Опции, которые будут переданы в секцию _options (см. <a href='https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/core/oop/'>ООП-обертка в веб-фреймворке WS</a>) компонента справочника.
             * @translatable caption
             */
            /**
             * @cfg {dictionaries[]} Устанавливает набор справочников для кнопки выбора.
             * @remark
             * Когда установлено несколько справочник, при клике по кнопке открывается меню выбора справочника.
             * Когда установлен один справочник, то он будет открыт сразу при клике по кнопке.
             * @example
             * <pre>
             *    <options name="dictionaries" type="array">
             *       <options>
             *          <option name="caption">Сотрудники</option>
             *          <option name="template">js!SBIS3.MyArea.DictEmployees</option>
             *       </options>
             *    <options>
             * </pre>
             */
            dictionaries: [],
            /**
             * @cfg {String} Устанавливает режим открытия компонента выбора.
             * @variant dialog Открытие производится в новом диалоговом окне.
             * @variant floatArea Открытие производится на всплывающей панели.
             */
            selectMode: 'floatArea',
            /**
             * @cfg {Boolean} Использовать для выбора {@link SBIS3.CONTROLS.Action.SelectorAction}
             */
            useSelectorAction: false
         },
         _text: null
      },
      $constructor: function() {
         var self = this;

         this.subscribe('onSelectedItemsChange', function(event, result, changed) {
            /* При добавлении элементов надо запустить валидацию,
                в противном случае при выборе записи валидация не спадёт с компонента */
            if(changed.added.length && !self._isEmptySelection()) {
               /* Надо дожидаться загрузки выбранных записей,
                  т.к. часто валидируют именно по ним,
                  или же по значениям в контексте */
               self.getSelectedItems(true).addCallback(function(list) {
                  self.validate();
                  return list
               })
            }
         });

         if(this._options.useSelectorAction) {
            this.subscribe('onInit', function () {
               this.subscribeTo(this._getSelectorAction(), 'onExecuted', function (event, meta, result) {
                  if (result) {
                     self.setSelectedItems(result);
                  }
               });
            });
         }
      },
      _drawSelectedItems: function() {
         var self = this,
             isSelected = !this._isEmptySelection();

         $('.controls-SelectorButton__cross', this._container[0]).toggleClass('ws-hidden', !isSelected);
         if(isSelected) {
            var linkTextArray = [];

            this.getSelectedItems(true).addCallback(function(list){
               list.each(function(item) {
                  linkTextArray.push(item.get(self._options.displayProperty));
               });
               self._setCaption(strHelpers.escapeHtml(linkTextArray.join(', ')));
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
         this._notifyOnSizeChanged();
      },

      _clickHandler: function(e) {
         var cfg = this.getDictionaries()[0];

         if($(e.target).hasClass('controls-SelectorButton__cross')) {
            this.removeItemsSelectionAll();
         } else if(cfg) {
            this.showSelector(cfg);
         }
      },

      showSelector: function(cfg) {
         if(this.getProperty('useSelectorAction')) {
            cfg.multiselect = this.getMultiselect();
            cfg.selectedItems = this.getSelectedItems();
            this._getSelectorAction().execute(cfg);
         } else {
            this._showChooser(cfg.template, cfg.componentOptions);
         }
      },

      _getSelectorAction: fHelpers.memoize(function() {
         return this.getChildControlByName('SelectorButtonSelectorAction');
      },'_getSelectorAction'),

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
   
      _notify: function () {
         return ItemsSelectionUtil.delayedNotify(
            SelectorButton.superclass._notify,
            arguments,
            this
         );
      },

      _prepareItems: function() {
         return ToSourceModel(
            SelectorButton.superclass._prepareItems.apply(this, arguments),
            this.getDataSource(),
            this._options.idProperty,
            this._options.saveParentRecordChanges
         );
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