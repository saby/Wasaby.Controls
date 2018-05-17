/**
 * Created by iv.cheremushkin on 13.08.2014.
 */
define(
   'SBIS3.CONTROLS/Tab/Buttons',
   [
      'SBIS3.CONTROLS/Radio/Group/RadioGroupBase',
      'tmpl!SBIS3.CONTROLS/Tab/Buttons/TabButtons',
      'tmpl!SBIS3.CONTROLS/Tab/Buttons/resources/ItemTemplate',
      'tmpl!SBIS3.CONTROLS/Tab/Buttons/resources/SpaceTemplate',
      'SBIS3.CONTROLS/Utils/TemplateUtil',
      'Core/core-instance',
      'SBIS3.CONTROLS/Tab/Button',
      'css!SBIS3.CONTROLS/Tab/Buttons/TabButtons'
   ],
   function (RadioGroupBase, TabButtonsTpl, ItemTemplate, SpaceTemplate, TemplateUtil, cInstance) {

      'use strict';

      /**
       * Класс контрола "Вкладки". Чтобы контрол правильно работал, требуется установить опции {@link idProperty} и {@link displayProperty}.
       * Используется для отображения вкладок. Также применяется в <a href='/docs/js/SBIS3/CONTROLS/TabControl/'>SBIS3.CONTROLS/Tab/Control</a> - отображает вкладки для <a href='/docs/js/SBIS3/CONTROLS/SwitchableArea/'>областей с контентом</a>.
       * Стандарт вкладок описан <a href='http://axure.tensor.ru/standarts/v7/%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_05_.html'>здесь</a>.
       * @remark
       * Чтобы скрыть одну вкладку, используйте следующий код:
       * <pre>
       *     // myId - идентификатор влкадки
       *     this.getChildControlByName('TabButtons').getItemInstance(myId).hide()
       * </pre>
       * @class SBIS3.CONTROLS/Tab/Buttons
       * @extends SBIS3.CONTROLS/Radio/Group/RadioGroupBase
       * @author Крайнов Д.О.
       *
       * @public
       * @demo Examples/TabButtons/MyTabButtons/MyTabButtons
       *
       * @cssModifier controls-TabButtons__simple-view Модификатор для вкладок второго уровня
       * @cssModifier controls-TabButtons__simple-view-select Устанавливает для вкладок второго уровня выделение рыжим цветом. Использовать совместно с модификатором "controls-TabButtons__simple-view".
       * @cssModifier controls-TabButtons__simple-view-mini Модификатор для неакцентных вкладок 2-го уровня.

       * @css controls-TabButton__counter для вкладок, в которых используется счетчик. сам счетчик обернуть в класс controls-tabButton__counter-value
       * @css controls-TabButton__counter-success для вкладок, в которых используется счетчик зеленого цвета. использовать совместно с controls-TabButton__counter
       * @css controls-TabButton__counter-error для вкладок, в которых используется счетчик красного цвета. использовать совместно с controls-TabButton__counter
       * @css controls-TabButton__mainText Используется для оформления текста владки, как у главной вкладки.
       * @css controls-TabButton__additionalText1 Используется для оформления текста обычной вкладки 2-го уровня, 1-ый стиль.
       * @css controls-TabButton__additionalText2 Используется для текста обычной вкладки 2-го уровня, 2-ой стиль.
       * @css controls-TabButton__main-item Используется для главной вкладки.
       */
      var
         buildTplArgs = function(cfg) {
            var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
            tplOptions.allowChangeEnable = cfg.allowChangeEnable;
            tplOptions.selectedKey = cfg.selectedKey;
            return tplOptions;
         },
         getRecordsForRedraw = function(projection, opts) {
            var order = 0,
                baseOrder = 30,
                firstLeftItem,
                lastRightItem,
                tmpl, itemTpl, item;
            if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
               var context = this.linkedContext;
               projection.each(function (itemProj) {
                  item = itemProj.getContents();
                  itemTpl = item.get(opts.displayProperty);

                  tmpl = itemTpl && TemplateUtil.prepareTemplate(itemTpl)({
                     item: item.getRawData(true),
                     options: opts
                  }, undefined, context);

                  if (item.get('align') === 'left') {
                     if (!firstLeftItem) {
                        firstLeftItem = item;
                     }
                     item.set('_order', order++);
                  }
                  else {
                     lastRightItem = item;
                     item.set('_order', baseOrder + order++);
                  }
                  item.set('_sideTab', false);
                  item.set(opts.displayProperty, tmpl || '');
               });

               if (firstLeftItem) {
                  firstLeftItem.set('_sideTab', true);
               }
               if (lastRightItem) {
                  lastRightItem.set('_sideTab', true);
               }
            }
            return projection;
         };
      var TabButtons = RadioGroupBase.extend(/** @lends SBIS3.CONTROLS/Tab/Buttons.prototype */ {
         $protected: {
            _options: {
               _canServerRender: true,
               _spaceTemplate: SpaceTemplate,
               _defaultItemTemplate: ItemTemplate,
               /**
                * @cfg {Content} Устанавливает содержимое между вкладками.
                * @example
                * <pre>
                *     <option name="tabSpaceTemplate">
                *        <component data-component="SBIS3.CONTROLS/Button" name="Button 1">
                *           <option name="caption">Кнопка между вкладками</option>
                *        </component>
                *     </option>
                * </pre>
                */
               tabSpaceTemplate: undefined,
               observeVisibleProperty: false, //Временное решение
               _getRecordsForRedraw: getRecordsForRedraw,
               _buildTplArgs: buildTplArgs
            }
         },
         _dotTplFn: TabButtonsTpl,

         $constructor: function() {
            //onBeforeTabChange - событие, которое стреляет перед сменой вкладки. Из него можно прервать смену вкладки.
            //Сейчас нужно только в новой карточке сотрудника для показа вопроса о сохранении
            this._publish('onBeforeTabChange');
         },

         _modifyOptions: function (opts) {
            opts = TabButtons.superclass._modifyOptions.apply(this, arguments);
            if (opts.tabSpaceTemplate) {
               opts.tabSpaceTemplate = TemplateUtil.prepareTemplate(opts.tabSpaceTemplate);
            }
            return opts;
         },

         _redrawItems: function() {
            TabButtons.superclass._redrawItems.apply(this, arguments);
            var tabSpaceTpl = this._options._spaceTemplate(this._options);
            this.getContainer().append(tabSpaceTpl);
            this.reviveComponents();
         },

         setItems: function (items) {
            var itemsRawData = cInstance.instanceOfModule(items, 'WS.Data/Collection/RecordSet') ? items.getRawData() : items;
            //TODO временное решение. Если бинд был сделан на опцию visible у итема, то не перерисовывает все вкладки. подробности https://inside.tensor.ru/opendoc.html?guid=52beaec0-1f23-4e10-a9ff-b2902e18707a&des=
            //Сделал через доп.опцию observeVisibleProperty, чтобы поведение включили там, где это нужно
            if (this._options.observeVisibleProperty && this.getItems().getCount() == itemsRawData.length) {
               var currentItems = this.getItems();
               for (var i = 0, l = itemsRawData.length; i < l; i++) {
                  var projection = this._options._itemsProjection,
                     id = itemsRawData[i][this._options.idProperty],
                     currentItem = currentItems.getRecordById(id),
                     projItem = projection.getItemBySourceItem(currentItem),
                     hash = projItem && projItem.getHash();
                  if (currentItem && typeof(itemsRawData[i]['visible']) == 'boolean' && currentItem.get('visible') !== itemsRawData[i]['visible']) {
                     this.getItemsInstances()[hash].setVisible(itemsRawData[i]['visible']);
                     currentItem.set('visible', itemsRawData[i]['visible']);
                  }
               }
            }
            else {
               TabButtons.superclass.setItems.apply(this, arguments);
            }
         },

         _itemActivatedHandler : function(hash) {
            var beforeChangeTabResult = this._notify('onBeforeTabChange'),
                baseMethod = TabButtons.superclass._itemActivatedHandler.bind(this),
                tabInstance = this.getItemsInstances()[hash];

            if (cInstance.instanceOfModule(beforeChangeTabResult, 'Core/Deferred')) {
               beforeChangeTabResult.addCallback(function(result) {
                  if (result !== false) {
                     tabInstance.setChecked(true);
                     baseMethod(hash);
                  }
               }.bind(this));
               tabInstance.setChecked(false);
            }
            else if (beforeChangeTabResult !== false) {
               baseMethod(hash);
            }
            else {
               tabInstance.setChecked(false);
            }
         }
      });
      return TabButtons;
   });