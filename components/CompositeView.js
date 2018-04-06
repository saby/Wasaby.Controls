define('SBIS3.CONTROLS/CompositeView', [
   'SBIS3.CONTROLS/DataGridView',
   'SBIS3.CONTROLS/Mixins/CompositeViewMixin',
   'css!SBIS3.CONTROLS/CompositeView/CompositeView',
   'css!SBIS3.CONTROLS/ListView/resources/ItemActionsGroup/ItemActionsGroup'], function(DataGridView, CompositeViewMixin) {
   'use strict';

      /**
       * Контрол, отображающий набор данных в виде таблицы, плитки или списка. Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/">Настройка списков</a>.
       *
       * @class SBIS3.CONTROLS/CompositeView
       * @extends SBIS3.CONTROLS/DataGridView
       * @mixes SBIS3.CONTROLS/Mixins/CompositeViewMixin
       *
       * @demo Examples/CompositeView/MyCompositeView/MyCompositeView
       * @cssModifier controls-TreeView-big Устанавливает для режима отображения "Список" следующий размер шрифта: для папок (узлов) - 16px, для записей (листьев) - 15px.
       *
       * @control
       * @public
       * @author Герасимов А.М.
       * @category Lists
       * @initial
       * <component data-component='SBIS3.CONTROLS/CompositeView'>
       *    <options name="columns" type="array">
       *       <options>
       *          <option name="title">Поле 1</option>
       *          <option name="width">100</option>
       *       </options>
       *       <options>
       *          <option name="title">Поле 2</option>
       *       </options>
       *    </options>
       * </component>
       */   
      
   var CompositeView = DataGridView.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS/CompositeView.prototype*/ {

      $protected: {

      },

      _onChangeHoveredItem: function(hoveredItem) {
         this._setHoveredStyles(hoveredItem.container);
         CompositeView.superclass._onChangeHoveredItem.apply(this, arguments);
      },

      _getInsertMarkupConfig: function() {
         var result;
         if (this._options.viewMode === 'table') {
            result = CompositeView.superclass._getInsertMarkupConfig.apply(this, arguments);
         } else {
            result = this._getInsertMarkupConfigICM.apply(this, arguments);
            //При добавлении элементов в начало списка, они добавляются перед FoldersContainer, а должны добавлять после него.
            //В таком случае явно укажем после какого блока вставить элементы.
            if (result.inside && result.prepend) {
               result.inside = false;
               result.prepend = false;
               result.container = this._getFoldersContainer();
            }
            //При добавлении элементов в конец списка, если там присутствуют пустышки для плитки, то элементы надо встаить
            //до этих пустышек, иначе образуется пустое пространство.
            if (this._hasInvisibleItems() && result.inside && !result.prepend) {
               result.inside = false;
               result.prepend = true;
               result.container = result.container.find('.controls-CompositeView__tileItem-invisible').first();
            }
         }
         return result;
      },

      _hasInvisibleItems: function() {
         return this._options.viewMode === 'tile' && this._options.tileMode === CompositeViewMixin.TILE_MODE.STATIC;
      }

   });
   CompositeView.TILE_MODE = CompositeViewMixin.TILE_MODE;
   return CompositeView;

});