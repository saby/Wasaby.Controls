/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroup',
   [
      'js!SBIS3.CONTROLS.CheckBoxGroupBase',
      'tmpl!SBIS3.CONTROLS.CheckBoxGroup',
      'tmpl!SBIS3.CONTROLS.CheckBoxGroup/resources/ItemTemplate',
      'js!SBIS3.CONTROLS.CheckBox',
      'css!SBIS3.CONTROLS.CheckBoxGroup'
   ],
   function(CheckBoxGroupBase, dotTplFn, ItemTemplate) {

   'use strict';

   /**
    * Контрол, отображающий группу чекбоксов
    * @class SBIS3.CONTROLS.CheckBoxGroup
    * @extends SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @demo SBIS3.CONTROLS.Demo.MyCheckBoxGroup
    * @author Крайнов Дмитрий Олегович
    * @cssModifier controls-ButtonGroup__vertical Задаёт вертикальное расположение элементов в группе.
    *
    * @control
    * @public
    * @category Inputs
    * @initial
    * <component data-component='SBIS3.CONTROLS.CheckBoxGroup'>
    *    <options name="items" type="array">
    *       <options>
    *          <option name="id">1</option>
    *          <option name="caption">CheckBox 1</option>
    *       </options>
    *       <options>
    *          <option name="id">2</option>
    *          <option name="caption">CheckBox 2</option>
    *       </options>
    *    </options>
    *    <option name="idProperty">id</option>
    *    <option name="displayProperty">caption</option>
    * </component>
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroup.prototype */ {
      _dotTplFn : dotTplFn,
       /**
        * @typedef {Object} GroupItems
        * @property {String} id Идентификатор элемента группы.
        * @property {String} caption Заголовок элемента группы.
        * @translatable caption
        */
       /**
        * @cfg {GroupItems[]} Набор исходных данных, по которому строится отображение группы
        * @name SBIS3.CONTROLS.CheckBoxGroup#items
        * @example
        * <pre class="brush:xml">
        *     <options name="items" type="array">
        *        <options>
        *            <option name="id">1</option>
        *            <option name="caption">Флажок_1</option>
        *         </options>
        *         <options>
        *            <option name="id">2</option>
        *            <option name="caption">Флажок_2</option>
        *         </options>
        *         <options>
        *            <option name="id">3</option>
        *            <option name="caption">Флажок_3</option>
        *         </options>
        *      </options>
        * </pre>
        */

      $protected: {
         _options: {
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate
         }
      }
   });

   return CheckBoxGroup;

});
