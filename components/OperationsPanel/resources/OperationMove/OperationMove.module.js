/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMove', [
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.MoveDialog',
   'js!SBIS3.CORE.Dialog',
], function(Link, MoveDialog, Dialog) {

   var OperationMove = Link.extend({

      $protected: {
         _options: {
            /**
             * @noShow
             */
            linkedView: undefined,
            /**
             * @cfg {String} Иконка кнопки перемещения
             * @editor icon ImageEditor
             */
            icon: 'sprite:icon-24 icon-Move icon-primary action-hover',
            title: 'Перенести отмеченные',
            caption: 'Перенести'
         }
      },

      $constructor: function() {
      },
      _clickHandler: function() {
         var selectedCount =  this._options.linkedView.getSelectedKeys().length;
         new Dialog ({
            opener : this._options.linkedView,
            template: 'js!SBIS3.CONTROLS.MoveDialog',
            resizable: false,
            title: 'Переместить ' + selectedCount + ' запис' + $ws.helpers.wordCaseByNumber(selectedCount, 'ей', 'ь', 'и') + ' в',
            handlers: {
               onBeforeShow: function(){
                  console.log('onBeforeShow');
               },
               onReady : function() {

               }
            }
         });
      }
   });

   return OperationMove;

});