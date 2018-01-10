/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('SBIS3.CONTROLS/Radio/Group/RadioGroupBase',
   [
      'SBIS3.CONTROLS/Button/ButtonGroup/ButtonGroupBase',
      'SBIS3.CONTROLS/Mixins/Selectable'
   ],
   function(ButtonGroupBase, Selectable) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS/Radio/Group/RadioGroupBase
    * @mixes SBIS3.CONTROLS/Mixins/Selectable
    * @extends SBIS3.CONTROLS/Button/ButtonGroup/ButtonGroupBase
    * @public
    * @author Крайнов Д.О.
    */

   var buildTplArgs = function(cfg) {
      var tplOptions = cfg._buildTplArgsSt.call(this, cfg);
      tplOptions.selectedKey = cfg.selectedKey;
      return tplOptions;
   };

   var RadioGroupBase = ButtonGroupBase.extend([Selectable], /** @lends SBIS3.CONTROLS/Radio/Group/RadioGroupBase.prototype */ {
      $protected: {
         _options: {
            allowEmptySelection: false,
            _buildTplArgs: buildTplArgs
         }
      },

      _itemActivatedHandler : function(hash) {
         var projItem, index;
         projItem = this._getItemsProjection().getByHash(hash);
         index = this._getItemsProjection().getIndex(projItem);
         this.setSelectedIndex(index);
      },

      _drawSelectedItem : function(id, index) {
         //TODO не будет работать с перечисляемым. Переписать
         var
            item = this._getItemsProjection().at(index),
            controls = this.getItemsInstances();
         if (item) {
            var hash = item.getHash();
            for (var i in controls) {
               if (controls.hasOwnProperty(i)) {
                  if (hash === undefined) {
                     controls[i].setChecked(false);
                  }
                  else {
                     if (controls[i].getContainer().data('hash') == hash) {
                        controls[i].setChecked(true);
                     }
                     else {
                        controls[i].setChecked(false);
                     }
                  }
               }
            }
         } else if (this._options.allowEmptySelection)  {
            for (var i in controls) {
               if (controls.hasOwnProperty(i)) {
                  controls[i].setChecked(false);
               }
            }
         }
      }
   });
   return RadioGroupBase;
});