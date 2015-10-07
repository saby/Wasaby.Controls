/* global define, $ws */

/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroup', [
   'js!SBIS3.CONTROLS.RadioGroupBaseNew',
   'js!SBIS3.CONTROLS.Data.Utils',
   'html!SBIS3.CONTROLS.RadioGroup',
   'js!SBIS3.CONTROLS.RadioButton'
], function(RadioGroupBase, Utils, dotTpl) {

   'use strict';

   /**
    * Контрол задающий оформление выбора одного из нескольких значений в виде классических радиокнопок
    * @class SBIS3.CONTROLS.RadioGroup
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @control
    * @author Крайнов Дмитрий Олегович
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyRadioGroup
    * @initial
    * <component data-component='SBIS3.CONTROLS.RadioGroup'>
    *    <option name="displayField">title</option>
    *    <option name="keyField">id</option>
    *    <options name="items" type="array">
    *       <options>
    *          <option name="id">1</option>
    *          <option name="title">RadioButton 1</option>
    *       </options>
    *       <options>
    *          <option name="id">2</option>
    *          <option name="title">RadioButton 2</option>
    *       </options>
    *    </options>
    * </component>
    *
    * @cssModifier controls-ButtonGroup__vertical Для вертикального расположения элементов в группе.
    * @cssModifier controls-Radio__primary акцентные кнопки
    *
    * @ignoreOptions className extendedTooltip handlers linkedContext
    *
    * @ignoreMethods applyState applyEmptyState getClassName findParent getEventHandlers  getEvents getExtendedTooltip
    * @ignoreMethods getOwner getOwnerId getTopParent getUserData makeOwnerName hasEvent hasEventHandlers once setOwner
    * @ignoreMethods sendCommand setClassName setExtendedTooltip setStateKey setUserData subscribe unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onKeyPressed onTooltipContentRequest
    */

   var RadioGroup = RadioGroupBase.extend( /** @lends SBIS3.CONTROLS.RadioGroup.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.RadioGroup',
      _dotTplFn : dotTpl,
       /**
        * @cfg {SBIS3.CONTROLS.CheckBoxGroup/GroupItems.typedef[]} Набор исходных данных, по которому строится отображение
        * @name SBIS3.CONTROLS.RadioGroup#items
        * @example
        * <pre class="brush:xml">
        *     <options name="items" type="array">
        *        <options>
        *            <option name="id">1</option>
        *            <option name="title">Кнопка_1</option>
        *         </options>
        *         <options>
        *            <option name="id">2</option>
        *            <option name="title">Кнопка_2</option>
        *         </options>
        *         <options>
        *            <option name="id">3</option>
        *            <option name="title">Кнопка_3</option>
        *         </options>
        *      </options>
        * </pre>
        */
       init: function() {
          this._initView();
       },

      _getItemTemplate: function () {
          return (function (data) {
             var caption = Utils.getItemPropertyValue(data.item, this._options.displayField);
             return '<component data-component="SBIS3.CONTROLS.RadioButton">' +
                '<option name="caption">' + caption + '</option>' +
                '</component>';
          }).bind(this);
      }
   });

   return RadioGroup;

});