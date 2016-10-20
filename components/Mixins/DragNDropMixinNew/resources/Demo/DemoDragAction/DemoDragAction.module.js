define('js!SBIS3.CONTROLS.Demo.DemoDragActions', [
      'js!SBIS3.CONTROLS.Action.Action', 'js!SBIS3.CONTROLS.DragObject', 'js!SBIS3.CONTROLS.Utils.InformationPopupManager'
],
function (Action, DragObject, InformationPopupManager) {
   return Action.extend({
      $protected: {
         _options: {
            donor: undefined,
            recepient: undefined
         }
      },
      _doExecute: function() {
         var newItems = [];
         if (DragObject.isDragging()) {
            DragObject.getSource().each(function(item){
               newItems.push(item.getModel());
            }, this);
         } else if(this._options.donor.getSelectedKey()) {
            var key =  this._options.donor.getSelectedKey(),
               items = this._options.donor.getItems(),
               item = items.getRecordById(key);
            this._options.recepient.getItems().add(item);
            items.remove(item);
            newItems = [item];
         }

         $ws.helpers.forEach(newItems, function(item) {
            this._options.recepient.getDataSource().update(item);
         }, this);
         if (newItems.length > 0) {
            var donor = this._options.donor.getName(),
               recepient = this._options.recepient.getName();
            InformationPopupManager.showNotification({
               status: 'success',
               caption: 'Перемещен элемент из ' + donor + ' в ' + recepient
            });
         }
      }
   });
});