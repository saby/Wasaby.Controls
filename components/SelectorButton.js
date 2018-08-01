/**
 * Created by am.gerasimov on 28.01.2016.
 */
define('SBIS3.CONTROLS/SelectorButton',
    [
   'tmpl!SBIS3.CONTROLS/SelectorButton/SelectorButton',
   "tmpl!SBIS3.CONTROLS/SelectorButton/resources/contentTemplate",
   "tmpl!SBIS3.CONTROLS/SelectorButton/resources/defaultItemContentTemplate",
   "tmpl!SBIS3.CONTROLS/SelectorButton/resources/defaultItemTemplate",
   "SBIS3.CONTROLS/WSControls/Buttons/Button",
   "SBIS3.CONTROLS/Mixins/ItemsControlMixin",
   "SBIS3.CONTROLS/Mixins/MultiSelectable",
   "SBIS3.CONTROLS/Mixins/ActiveMultiSelectable",
   "SBIS3.CONTROLS/Mixins/Selectable",
   "SBIS3.CONTROLS/Mixins/ActiveSelectable",
   "SBIS3.CONTROLS/Mixins/SyncSelectionMixin",
   "SBIS3.CONTROLS/Mixins/ChooserMixin",
   "SBIS3.CONTROLS/Mixins/IconMixin",
   "Core/core-instance",
   'Core/helpers/String/escapeTagsFromStr',
   'SBIS3.CONTROLS/Utils/ToSourceModel',
   'SBIS3.CONTROLS/Utils/ItemsSelectionUtil',
   'WS.Data/Collection/List',
   "SBIS3.CONTROLS/Action/SelectorAction",
   'css!SBIS3.CONTROLS/SelectorButton/SelectorButton'
],
    function(
       dotTplFn,
       contentTemplate,
       defaultItemContentTemplate,
       defaultItemTemplate,
       WSButton,
       ItemsControlMixin,
       MultiSelectable,
       ActiveMultiSelectable,
       Selectable,
       ActiveSelectable,
       SyncSelectionMixin,
       ChooserMixin,
       IconMixin,
       cInstance,
       escapeTagsFromStr,
       ToSourceModel,
       ItemsSelectionUtil,
       List,
       SelectorAction
       
    ) {

   'use strict';
   
   /**
    * Класса контрола "Кнопка выбора", который отображает выбранные записи в виде текстовых значений через запятую.
    * Контрол применяется в качестве альтернативы полю связи {@link SBIS3.CONTROLS/FieldLink}.
    *
    * Подробнее о поле связи и кнопке выбора вы можете прочитать в разделе <a href='/doc/platform/developmentapl/interface-development/components/textbox/field-link/'>Поле связи</a>.
    * Обратить внимание: метод <a href='/docs/WSControls/Buttons/Button/methods/setCaption/'>setCaption</a>, устанавливающий текст на кнопке, не работает.
    * caption проставляется только по выбору записи по displayProperty или же строится по шаблону.
    *
    * @class SBIS3.CONTROLS/SelectorButton
    * @extends WSControls/Buttons/Button
    *
    * @author Герасимов А.М.
    *
    * @mixes SBIS3.CONTROLS/Mixins/IconMixin
    * @mixes SBIS3.CONTROLS/Mixins/MultiSelectable
    * @mixes SBIS3.CONTROLS/Mixins/ActiveMultiSelectable
    * @mixes SBIS3.CONTROLS/Mixins/Selectable
    * @mixes SBIS3.CONTROLS/Mixins/ActiveSelectable
    * @mixes SBIS3.CONTROLS/Mixins/SyncSelectionMixin
    * @mixes SBIS3.CONTROLS/Mixins/ChooserMixin
    * @mixes SBIS3.CONTROLS/Mixins/ItemsControlMixin
    *
    * @cssModifier controls-SelectorButton__asLink Отображает текст как ссылку.
    * @cssModifier controls-SelectorButton__withoutCross Скрывает крестик справа от текста.
    *
    * @demo Examples/SelectorButton/SelectorButtonLink/SelectorButtonLink Пример 1. Кнопка выбора в виде иконки, поле ввода отсутствует. Вызов справочника производится кликом по кнопке с иконкой. Все выбранные значения будут отображаться справа от кнопки.
    * В режиме множественного выбора сброс выбранных значений производится массово кликом по серому крестику.
    * @demo Examples/SelectorButton/SelectorButtonSingle/SelectorButtonSingle Пример 2. Кнопка выбора в виде кнопки-ссылки, поле ввода отсутствует. Вызов справочника производится кликом по ссылке. Все выбранные значения будут отображаться в качестве текста кнопки.
    * В режиме множественного выбора удаление выбранных значений производится массово кликом по серому крестику. Для корректного отображения кнопки-ссылки используется CSS-модификатор "controls-SelectorButton__asLink".
    *
    * @category Button
    * @control
    * @public
    */

   var SelectorButton = WSButton.extend([ItemsControlMixin, MultiSelectable, ActiveMultiSelectable, Selectable, ActiveSelectable, SyncSelectionMixin, ChooserMixin, IconMixin], /** @lends SBIS3.CONTROLS/SelectorButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            clickThrottle: true,
            contentTemplate: contentTemplate,
            _serverRender: true,
            _defaultItemContentTemplate: defaultItemContentTemplate,
            _defaultItemTemplate: defaultItemTemplate,
            _selectorAction: null,
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
             * @property {Object} componentOptions Опции, которые будут переданы в секцию _options (см. <a href='/doc/platform/developmentapl/interface-development/core/oop/'>ООП-обертка в веб-фреймворке WS</a>) компонента справочника.
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
             *          <option name="template">Examples/MyArea/DictEmployees</option>
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
             * @cfg {Boolean} Использовать для выбора {@link SBIS3.CONTROLS/Action/SelectorAction}
             * @remark
             * При включенной опции в <a href='/docs/js/SBIS3/CONTROLS/FieldLink/options/dictionaries/'>dictionaries</a> можно передать <a href='/docs/js/SBIS3/CONTROLS/FieldLink/typedefs/Dictionaries/'>dialogOptions</a>.
             */
            useSelectorAction: false,
            /**
             * @cfg {Boolean} Скрывает крестик справа от текста.
             */
            withoutCross: false
         }
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
                  return list;
               });
            }
         });

         if(this._options.useSelectorAction) {
            this.subscribe('onInit', function () {
               ItemsSelectionUtil.initSelectorAction(this._getSelectorAction(), this);
            });
         }
      },
      
      _modifyOptions: function(parOpts, parsedOptions, attrToMerge) {
         var opts = SelectorButton.superclass._modifyOptions.apply(this, arguments),
             className = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '';
         
         if (className.indexOf('controls-SelectorButton__withoutCross') !== -1) {
            opts.withoutCross = true;
         }
   
         if(opts.selectedItem && cInstance.instanceOfModule(opts.selectedItem, 'WS.Data/Entity/Model')) {
            opts.items = new List({items: [opts.selectedItem]});
         } else if (opts.selectedItems) {
            opts.items = opts.selectedItems;
         }
         if(opts.items) {
            opts._records = opts._getRecordsForRedraw(opts._createDefaultProjection(opts.items, opts), opts);
            opts._itemData = opts._buildTplArgs(opts);
         }
         return opts;
         
      },
      _drawSelectedItems: function() {
         var self = this,
            items;
         this.getSelectedItems(true).addCallback(function(list){
            items = self.getItems();
         
            if(list) {
               self.setItems(list);
            } else if(items) {
               // TODO перевести на observableList, для этого необходимо отказать от получание записей по методу getRecordById
               items.clear();
               self.setItems(items);
            } else {
               self.setItems(new List());
            }
            return list;
         });
      },
   
      _toggleEmptyData: function(empty) {
         var itemsContainer = this._getItemsContainer();
         
         if(!this._options.withoutCross) {
            this._container.find('.controls-SelectorButton__cross').toggleClass('ws-hidden', empty);
         }
         
         if(empty) {
            itemsContainer.text(this.getProperty('defaultCaption')).removeAttr('title');
         } else if(!this._options.itemContentTpl && !this._options.itemTpl) {
            itemsContainer.attr('title', this.getCaption());
         }
      },
   
      _setSelectedIndex: function(selectedIndex) {
         if(this.getSelectedIndex() !== selectedIndex) {
            SelectorButton.superclass._setSelectedIndex.apply(this, arguments);
         }
      },
      
      _getItemsContainer: function() {
         return this.getContainer().find('.controls-Button__text');
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
         if(this._options.selectedKey !== key) {
            this._options.selectedKey = key;
            this._notifySelectedItem(this._options.selectedKey);
         }
      },

      setCaption: function(caption) {
         throw new Error('SelectorButton::setCaption св-во caption работает только на чтение');
      },
      
      getCaption: function() {
         var displayText = [],
             selectedItems = this.getSelectedItems(),
             self = this;
   
         if(selectedItems) {
            selectedItems.each(function(rec) {
               displayText.push(
                  escapeTagsFromStr((rec.get(self._options.displayProperty) || '').replace(/<br>/g, '\n'), '\\w+')
               );
            });
         }
   
         return displayText.join(', ');
      },

      _clickHandler: function(e) {
         var cfg = this.getDictionaries()[0],
             self = this;
   
         ItemsSelectionUtil.clickHandler.call(self, e.target,
            function() {
               self.removeItemsSelectionAll();
            },
            function(id) {
               if(self.isEnabled()) {
                  if(cfg) {
                     self.showSelector(cfg);
                  }
               } else if (id !== undefined) {
                  ItemsSelectionUtil.onItemClickNotify.call(self, id);
               }
            }
         );
      },
   
      _checkEnabledByClick: function () {
         return true;
      },

      showSelector: function(cfg){
            if(this.getProperty('useSelectorAction')) {
               cfg.multiselect = this.getMultiselect();
               cfg.selectedItems = this.getSelectedItems();
               cfg.opener = this; //Т.к. selectorAction создаётся из кода, и ему не назначается parent (так надо, см. коммент. ниже)
               if(this._notify('onSelectorClick', cfg) !== false) {this._getSelectorAction().execute(cfg)}
            } else {
               this._showChooser(cfg.template, cfg.componentOptions, cfg.dialogOptions);
            
         }
      },

      _getSelectorAction: function() {
         if (!this._selectorAction) {
            /* В AreaAbstract сейчас такое поведение:
               если у compoundControl'a ни один дочерний компонент не принимает фокус,
               то и сам контрол не принимает фокус ( Шипин ). Если action положить в вёрстку,
               то он зарегистрируется, как дочерний контрол для selectorButton'a и никогда не примет фокус,
               поэтому создаю action кодом, чтобы он не был дочерним для SelectorButton'a.
               (По словам Шипина, в AreaAbstract это починить очень дорого). */
            this._selectorAction = new SelectorAction({
               mode: this._getOption('selectMode'),
               visible: false,
               closeByFocusOut: true
            });
         }
         return this._selectorAction;
      },

      /**
       * Установить набор диалогов выбора для поля связи
       * @param {Array} dictionaries Набор диалогов выбора для поля связи
       */
      setDictionaries: function (dictionaries) {
         this._options.dictionaries = dictionaries;
         this._notifyOnPropertyChanged('dictionaries');
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

      reload: function () {
         
      },
      _setSelectedItems: function () {
         
      },
      destroy: function () {
         if (this._selectorAction) {
            this._selectorAction.destroy();
            this._selectorAction = null;
         }
         SelectorButton.superclass.destroy.call(this);
      }
   });

   return SelectorButton;

});
