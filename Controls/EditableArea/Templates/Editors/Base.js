define('Controls/EditableArea/Templates/Editors/Base', [
   'Core/Control',
   'wml!Controls/EditableArea/Templates/Editors/Base/Base',
   'css!theme?Controls/EditableArea/Templates/Editors/Base'
], function(
   Control,
   template
) {
   'use strict';

   /**
    * Base template for editing of input fields. Mimicks styles of {@link Controls/Input/Text Controls/Input/Text}.
    * <a href="/materials/demo-ws4-editable-area">Demo</a>.
    *
    * @class Controls/EditableArea/Templates/Editors/Base
    * @extends Core/Control
    * @author Зайцев А.С.
    * @public
    *
    * @css @border-width_EditableAreaTemplate-Base Size of the border of the input field.
    * @css @padding_EditableAreaTemplate-Base Input padding.
    * @css @font-size_EditableAreaTemplate-Base_style_accentHeader Font size of the input field with the style option set to "accentHeader".
    * @css @font-weight_EditableAreaTemplate-Base_style_accentHeader Font weight of the input field with the style option set to "accentHeader".
    * @css @color_EditableAreaTemplate-Base_style_accentHeader Text color of the input field with the style option set to "accentHeader".
    *
    * @see Controls/EditableArea/Templates/Editors/DateTime
    *
    * @demo Controls-demo/EditableArea/EditableAreaPG
    */

   var Base = Control.extend({
      _template: template,

      _prepareValueForEditor: function(value) {
         return value;
      },

      _editorValueChangeHandler: function(event, value) {
         this._notify('valueChanged', [value]);
      }
   });

   return Base;
});
