define('js!SBIS3.CONTROLS.CompoundFocusMixin', function() {
   /**
    * @class $ws.mixins.CompoundFocusMixin
    */
   var CompoundFocusMixin = /** @lends $ws.mixins.CompoundFocusMixin.prototype */{
      $constructor: function () {
         this._publish('onChildControlFocusOut', 'onChildControlFocusIn');
         var channel = $ws.single.EventBusGlobalChannel;
         var onFocusIn = function (event) {
            var control = event.getTarget(), parent, newActive;
            if (control.isActive() && control !== this) {
               parent = control.getParent();
               while (parent && parent !== this) {
                  parent = parent.getParent();
               }
               newActive = parent === this;
               if (newActive) {
                  this._notify('onChildControlFocusIn', control);
               }
            }
         }.bind(this);
         var onFocusOut = function (event) {
            var control = event.getTarget(), parent;
            parent = control.getParent();
            while (parent && parent !== this) {
               parent = parent.getParent();
            }
            if (parent === this) {
               this._notify('onChildControlFocusOut', control);
            }
         }.bind(this);
         this.subscribeTo(channel, 'onFocusIn', onFocusIn);
         this.subscribeTo(channel, 'onFocusOut', onFocusOut);
      }
   };

   return CompoundFocusMixin;
});
