define('js!SBIS3.CONTROLS.CompositeViewNew', ['js!SBIS3.CONTROLS.DataGridView', 'js!SBIS3.CONTROLS.CompositeViewMixinNew'], function (DataGridView, CompositeViewMixin) {
   'use strict';

      /**
       * Контрол отображающий набор данных, в виде таблицы, плитки или списка
       * @class SBIS3.CONTROLS.CompositeView
       * @extends SBIS3.CONTROLS.DataGridView
       * @mixes SBIS3.CONTROLS.CompositeViewMixin
       * @public
       * @author Крайнов Дмитрий Олегович
       * @control
       * @initial
       * <component data-component='SBIS3.CONTROLS.CompositeView'>
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
       *
       * @demo SBIS3.CONTROLS.Demo.MyCompositeView
       * 
       */   
      
   return DataGridView.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.CompositeView.prototype*/ {

      $protected: {

      }

   });

});