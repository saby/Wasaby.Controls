define('Controls-demo/Popup/Compatible/TestStack', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestStack'
], function(CompoundControl, dotTplFn) {
   var TestStack = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      _onAfterVisibilityChangeElement: null,
      _onAfterVisibilityChangeTimes: 0,

      _onControlResizeElement: null,
      _onControlResizeTimes: 0,

      _popupContainer: null,
      _lastLeftPosition: 0,
      _checkLeftPositionInterval: null,
      _leftPositionTestElement: null,

      init: function() {
         TestStack.superclass.init.apply(this, arguments);

         this._onAfterVisibilityChangeElement = this.getContainer().find('.onAfterVisibilityChangeTimes');
         this._onControlResizeElement = this.getContainer().find('.onControlResizeTimes');
         this._leftPositionTestElement = this.getContainer().find('.leftPositionTest');

         var
            compoundArea = this.getParent(),
            origNotifyVDOM = compoundArea._notifyVDOM;

         compoundArea._notifyVDOM = function(evName) {
            if (this._onControlResizeElement && evName === 'controlResize') {
               this._onControlResizeElement.text(++this._onControlResizeTimes);
            }
            origNotifyVDOM.apply(compoundArea, arguments);
         }.bind(this);

         compoundArea.subscribe('onAfterVisibilityChange', this._onAfterVisibilityChange.bind(this));

         // eventCheck
         this.getChildControlByName('eventCheckShow').subscribe('onActivated', function() {
            compoundArea.show();
         });
         this.getChildControlByName('eventCheckHide').subscribe('onActivated', function() {
            this._lastLeftPosition = this._popupContainer.css('left');
            compoundArea.hide();
         }.bind(this));

         // crashTest
         this.getChildControlByName('crashTest').subscribe('onActivated', function() {
            compoundArea._options.autoCloseOnHide = true;
            compoundArea.rebuildChildControl();
            compoundArea.close();
         });

         // resizeTest
         this.getChildControlByName('resizeCheckPanel').subscribe('onActivated', function() {
            this._notifyOnSizeChanged();
         }.bind(this));
         this.getChildControlByName('resizeCheckButton').subscribe('onActivated', function() {
            this.getChildControlByName('resizeCheckButton')._notifyOnSizeChanged();
         }.bind(this));

         var container = $(this.getParent()._container);
         this._popupContainer = container.parent();
      },

      _onAfterVisibilityChange: function(ev, visible) {
         var self = this;

         self._onAfterVisibilityChangeElement.text(++self._onAfterVisibilityChangeTimes);
         if (visible && !self._checkLeftPositionInterval) {
            // the popup is starting to show, wait for it to display (no ws-hidden and ws-invisible classes)
            // and check that it has the same exact position, as it did before hiding
            self._checkLeftPositionInterval = setInterval(function() {
               if (!self._popupContainer.hasClass('ws-hidden') && !self._popupContainer.hasClass('ws-invisible')) {
                  // if popup is visible, check the `left` position and compare it to the previous one
                  var
                     newLeft = self._popupContainer.css('left'),
                     passedTheTest = newLeft === self._lastLeftPosition;

                  self._leftPositionTestElement.text(passedTheTest);

                  clearInterval(self._checkLeftPositionInterval);
                  self._checkLeftPositionInterval = null;
               }
            }, 10);
         }
      },

      destroy: function() {
         this._onAfterVisibilityChangeElement = null;
         this._onControlResizeElement = null;
         this._popupContainer = null;
         if (this._checkLeftPositionInterval) {
            clearInterval(this._checkLeftPositionInterval);
            this._checkLeftPositionInterval = null;
         }
         this._leftPositionTestElement = null;

         TestStack.superclass.destroy.apply(this, arguments);
      }
   });

   return TestStack;
});
