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
      }

   });
   CompositeView.TILE_MODE = CompositeViewMixin.TILE_MODE;
   return CompositeView;

});