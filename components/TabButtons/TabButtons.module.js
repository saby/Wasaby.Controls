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
      'js!SBIS3.CONTROLS.TabButton'
   ],
   function (RadioGroupBase, TabButtonsTpl, ItemTemplate, MarkupTransformer, TemplateUtil) {

   'use strict';

   /**
    * Контрол, отображающий корешки закладок
    * Для корректной работы необходимо задание свойсв {@link keyField} и {@link displayField}
    * Для оформления компонентов внутри вкладки, можно использовать следующие классы:
    * <ol>
    *    <li><strong>controls-TabButton__mainText</strong> - параметры текста, как у главной вкладки</li>
    *    <li><strong>controls-TabButton__additionalText1</strong> - оформление дополнительного текста 1</li>
    *    <li><strong>controls-TabButton__additionalText2</strong> - оформление дополнительного текста 2</li>
    * </ol>
    * Также для отдельных вкладок можно использовать модификаторы:
    * <ol>
    *    <li><strong>controls-TabButton__counter</strong> - оформления вкладок-счётчиков с иконками</li>
    *    <li><strong>controls-TabButton__main-item</strong> - оформления главной вкладки</li>
    * </ol>
    * @class SBIS3.CONTROLS.TabButtons
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyTabButtons
    */
   var
      buildTplArgs = function(cfg) {
         var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
         tplOptions.allowChangeEnable = cfg.allowChangeEnable;
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
         return opts;
      }
   });
   return TabButtons;
});