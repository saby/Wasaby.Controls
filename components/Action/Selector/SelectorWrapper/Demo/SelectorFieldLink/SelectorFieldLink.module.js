/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.CONTROLS.Demo.SelectorFieldLink', 
   [
      'js!SBIS3.CORE.CompoundControl', 
      'html!SBIS3.CONTROLS.Demo.SelectorFieldLink', 
      'js!SBIS3.CONTROLS.RadioGroup', 
      'js!SBIS3.CONTROLS.Link', 
      'js!SBIS3.CONTROLS.FieldLink', 
      'js!SBIS3.CONTROLS.SelectorButton', 
      'js!SBIS3.CONTROLS.TextBox', 
      'js!SBIS3.CONTROLS.Action.SelectorAction'
   ], 
   function(
      CompoundControl, 
      dotTplFn
   ) {
   var SelectorFieldLink = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      init: function() {
         SelectorFieldLink.superclass.init.apply(this, arguments);
         
         var fieldLink = this.getChildControlByName('fieldLink');
         var action = this.getChildControlByName('SelectorAction');

         var radioMultiselect = this.getChildControlByName('buttonMultiselect');
         var radioSelectionType = this.getChildControlByName('buttonSelectionType');


         radioMultiselect.subscribe('onSelectedItemChange', function() {
            var currentMultiselect = true;
            if (radioMultiselect.getSelectedIndex() == 1) {
               currentMultiselect = false;
            }
            fieldLink.setMultiselect(currentMultiselect);
         });

         radioSelectionType.subscribe('onSelectedItemChange', function() {
            var currentSelectionType = 'all';
            var enterToFolder = 'true';
            if (radioSelectionType.getSelectedIndex() == 1) {
               currentSelectionType = 'node';
               enterToFolder = 'false';
            } else if (radioSelectionType.getSelectedIndex() == 2) {
               currentSelectionType = 'leaf';
            }
            var flDic = fieldLink.getProperty('dictionaries');
            flDic[0].selectionType = currentSelectionType;
            flDic[0].allowEnterToFolder = enterToFolder;
            fieldLink.setDictionaries(flDic);
         });
         
      }
   });
   
  

   return SelectorFieldLink;
});
