/**
 * @author Коновалова А.И.
 */
define('js!SBIS3.CONTROLS.Demo.SelectorActionButton', 
   [
      'js!SBIS3.CORE.CompoundControl', 
      'html!SBIS3.CONTROLS.Demo.SelectorActionButton',
       'js!SBIS3.CONTROLS.Link',
       'js!SBIS3.CONTROLS.Action.SelectorAction',
       'js!SBIS3.CONTROLS.FieldLink',
       'js!SBIS3.CONTROLS.RadioGroup', 
       'js!SBIS3.CONTROLS.Button', 
       'js!SBIS3.CONTROLS.TextArea'
   ], function(CompoundControl, dotTplFn) {
       'use strict';
   var SelectorActionButton = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      init: function() {
         SelectorActionButton.superclass.init.apply(this, arguments);
         
             var buttonLnk = this.getChildControlByName('showLink');
             var buttonTxt = this.getChildControlByName('showText');
             var selectTxt = this.getChildControlByName('selectText');
             var action = this.getChildControlByName('SelectorAction');
             
             var currentMultiselect = true;
             var currentSelectionType = 'all';
             var currentSelectedItems;


             buttonLnk.subscribe('onActivated', function() {
                var def  = action.execute( {
                   template: 'js!SBIS3.CONTROLS.Demo.SelectorActionButtonData',
                   selectionType: currentSelectionType,
                   multiselect: currentMultiselect
                } );
                action.once('onExecuted', function(event, meta, result) {
                   var resText = [];
                   if(result) {
                      result.each(function(rec) {
                         resText.push(rec.get('книга') + ' ');
                      });
                      buttonLnk.setCaption('Выбрали: ' + resText.join(','));
                   }
                });
             });
             
             buttonTxt.subscribe('onActivated', function() {
                var def  = action.execute( {
                   template: 'js!SBIS3.CONTROLS.Demo.SelectorActionDataB',
                   selectionType: currentSelectionType,
                   multiselect: currentMultiselect,
                   selectedItems: currentSelectedItems
                } );
                action.once('onExecuted', function(event, meta, result) {
                   var resText="";
                   var resStr="";

                   if(result) {
                      result.each(function(rec) {
                         resStr = rec.get('книга');
                         while (resStr.length < 70) {
                            resStr = resStr + ' '; 
                         }
                         resText = resText + resStr;
                      });
                     selectTxt.setText(resText);
                     currentSelectedItems = result;                
                   }
                });
             });
             
             
             
      }
   });
   
   

   return SelectorActionButton;
});


