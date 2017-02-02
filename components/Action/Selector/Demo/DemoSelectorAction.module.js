/**
 * Created by am.gerasimov on 28.09.2016.
 */
/*global $ws, define*/
define('js!SBIS3.CONTROLS.Demo.DemoSelectorAction',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.DemoSelectorAction',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.Action.SelectorAction',
      'js!SBIS3.CONTROLS.FieldLink',
      'js!SBIS3.CONTROLS.RadioGroup'
   ],
   function (CompoundControl, dotTplFn) {
      'use strict';

      var DemoSelectorAction = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
         },

         $constructor: function () {},

         init: function() {
            DemoSelectorAction.superclass.init.apply(this, arguments);
            var button = this.getChildControlByName('showSelector'),
                fieldLink = this.getChildControlByName('fieldLink'),
                action = this.getChildControlByName('SelectorAction'),
                radioMultiselect = this.getChildControlByName('multiselect'),
                radioSelectionType = this.getChildControlByName('selectionType'),
                currentMultiselect = true,
                currentSelectionType = 'leaf';

            radioMultiselect.subscribe('onSelectedItemChange', function() {
               currentMultiselect = radioMultiselect.getItems().at(radioMultiselect.getSelectedIndex()).get('res');
               fieldLink.setMultiselect(currentMultiselect);
            });

            radioSelectionType.subscribe('onSelectedItemChange', function() {
               var flDic = fieldLink.getProperty('dictionaries');
               currentSelectionType = radioSelectionType.getItems().at(radioSelectionType.getSelectedIndex()).get('res');
               flDic[0].selectionType = currentSelectionType;
               fieldLink.setDictionaries(flDic);
            });

            button.subscribe('onActivated', function() {
               var def  = action.execute( {
                   template: 'js!SBIS3.CONTROLS.Demo.DemoDataGridSelector',
                   selectionType: currentSelectionType,
                   multiselect: currentMultiselect
               });
               action.once('onExecuted', function(event, meta, result) {
                  var resText = [];
                  if(result) {
                     result.each(function(rec) {
                        resText.push(rec.get('Имя') + ' ' + rec.get('Фамилия'));
                     });
                     button.setCaption('Выбрали: ' + resText.join(','));
                  }
               })
            });
         }

      });
      return DemoSelectorAction;
   }
);