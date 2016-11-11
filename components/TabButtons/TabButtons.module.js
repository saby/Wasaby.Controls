/**
 * Created by iv.cheremushkin on 13.08.2014.
 */
define(
   'js!SBIS3.CONTROLS.TabButtons',
   [
      'js!SBIS3.CONTROLS.RadioGroupBase',
      'html!SBIS3.CONTROLS.TabButtons',
      'html!SBIS3.CONTROLS.TabButtons/resources/ItemTemplate',
      'js!SBIS3.CORE.MarkupTransformer',
      'js!SBIS3.CONTROLS.Utils.TemplateUtil',
      'Core/ParserUtilities',
      'js!SBIS3.CONTROLS.TabButton'
   ],
   function (RadioGroupBase, TabButtonsTpl, ItemTemplate, MarkupTransformer, TemplateUtil, ParserUtilities) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * Для корректной работы необходимо задание свойсв {@link keyField} и {@link displayField}
    * Также для отдельных вкладок можно использовать модификаторы:
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyTabButtons
    *
    * @cssModifier controls-TabButtons__simple-view Модификатор для вкладок второго уровня
    * @cssModifier controls-TabButtons__simple-view-select Модификатор для вкладок второго уровня с рыжим цветом выделенной вкладки. использовать совместно с controls-TabButtons__simple-view
    * @cssModifier controls-TabButtons__simple-view-mini Модификатор для неакцентных вкладок второго уровня

    * @css controls-TabButton__counter для вкладок, в которых используется счетчик. сам счетчик обернуть в класс controls-tabButton__counter-value
    * @css controls-TabButton__counter-success для вкладок, в которых используется счетчик зеленого цвета. использовать совместно с controls-TabButton__counter
    * @css controls-TabButton__counter-error для вкладок, в которых используется счетчик красного цвета. использовать совместно с controls-TabButton__counter
    * @css controls-TabButton__mainText параметры текста, как у главной вкладки
    * @css controls-TabButton__additionalText1 оформление дополнительного текста 1
    * @css controls-TabButton__additionalText2 оформление дополнительного текста 2
    * @css controls-TabButton__main-item оформления главной вкладки
    */
   var
      buildTplArgs = function(cfg) {
         var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
         tplOptions.allowChangeEnable = cfg.allowChangeEnable;
         tplOptions.selectedKey = cfg.selectedKey;
         return tplOptions;
      },
      getRecordsForRedraw = function(projection) {
         var
            records = {
               'left' : [],
               'right': []
            };
         if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
            projection.each(function (item) {
               var align = item.getContents().get('align') || 'right';
               records[align].push(item);
            });
         }
         return records;
      };
   var TabButtons = RadioGroupBase.extend(/** @lends SBIS3.CONTROLS.TabButtons.prototype */ {
      $protected: {
         _options: {
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate,
            /**
             * @cfg {Content} содержимое между вкладками
             * @example
             * <pre>
             *     <option name="tabSpaceTemplate">
             *        <component data-component="SBIS3.CONTROLS.Button" name="Button 1">
             *           <option name="caption">Кнопка между вкладками</option>
             *        </component>
             *     </option>
             * </pre>
             */
            tabSpaceTemplate: undefined,
            _getRecordsForRedraw: getRecordsForRedraw,
            _buildTplArgs: buildTplArgs
         }
      },
      _dotTplFn: TabButtonsTpl,

      $constructor: function () {
         this._leftContainer  = this.getContainer().find('.controls-TabButtons__leftContainer');
         this._rightContainer = this.getContainer().find('.controls-TabButtons__rightContainer');
      },

      /* Переопределяем получение контейнера для элементов */
      _getTargetContainer:function(item){
         return item.get('align') === 'left' ? this._leftContainer : this._rightContainer;
      },

      _modifyOptions: function (opts) {
         opts = TabButtons.superclass._modifyOptions.apply(this, arguments);
         if (opts.tabSpaceTemplate) {
            opts.tabSpaceTemplate = MarkupTransformer(TemplateUtil.prepareTemplate(opts.tabSpaceTemplate));
         }
         var items = opts.items;
         if (items){
            for (var i = 0, l = opts.items.length; i < l; i++){
               var tmpl = MarkupTransformer(TemplateUtil.prepareTemplate(items[i][opts.displayField] || '')({
                  item: items[i],
                  options: opts
               }));
               items[i][opts.displayField] = tmpl;
            }
         }

         return opts;
      },

      _redrawItems : function() {

            var
               data = this._prepareItemsData(),
               markupLeft, markupRight;

            data.tplData = this._prepareItemData();

         markupLeft = ParserUtilities.buildInnerComponents(MarkupTransformer(this._options._itemsTemplate({records : data.records.left, tplData : data.tplData})), this._options);
         markupRight = ParserUtilities.buildInnerComponents(MarkupTransformer(this._options._itemsTemplate({records : data.records.right, tplData : data.tplData})), this._options);

         this._destroyInnerComponents(this._leftContainer);
         this._destroyInnerComponents(this._rightContainer);
         this._itemsInstances = {};
         if (markupLeft.length) {
            this._leftContainer.get(0).innerHTML = markupLeft;
         }
         if (markupRight.length) {
            this._rightContainer.get(0).innerHTML = markupRight;
         }
         this._reviveItems();
         this._container.addClass('controls-ListView__dataLoaded');
         }


   });
   return TabButtons;
});