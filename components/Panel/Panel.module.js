define('js!SBIS3.CONTROLS.Panel', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Panel', 'css!SBIS3.CONTROLS.Panel'], function(CompoundControl, dotTplFn) {
   /**
    * Класс контрола "Панель", который предназначен для организации разметки визуального компонента.
    * Аналог тега div.
    * SBIS3.CONTROLS.Panel
    * @class SBIS3.CONTROLS.Panel
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @designTime actions /design/design
    * @designTime plugin /design/DesignPlugin 
    * @initial
    * <component data-component="SBIS3.CONTROLS.Panel">
    * </component>
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Panel.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Content} Устанавливает разметку, которая будет добавлена внутрь панели.
             * @example
             * <pre>
             *     <option name="content">
             *        <component data-component="SBIS3.CONTROLS.Button" name="myButton">
             *           <option name="caption">Кнопка между вкладками</option>
             *        </component>
             *     </option>
             * </pre>
             */
            content: ""
         }
      }, 
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
      }
   });
   return moduleClass;
});