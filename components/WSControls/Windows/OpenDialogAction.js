define('js!WSControls/Windows/OpenDialogAction',
   [
      'Core/Control',
      'js!WSControls/Windows/PopupManager',
      'js!WSControls/Windows/Strategy/DialogPositioningStrategy',
      'js!WSControls/Windows/Strategy/StackPositioningStrategy',
      'js!WSControls/Windows/Strategy/StickyPositioningStrategy',
      'js!WSControls/Windows/Strategy/PushPositioningStrategy'
   ], function(Control, PopupManager, DialogStrategy, StackStrategy, StickyStrategy, PushStrategy) {
      var OpenDialogAction = Control.extend({
         _controlName: 'WSControls/Windows/OpenDialogAction',
         iWantVDOM: true,

         constructor: function(cfg) {
            OpenDialogAction.superclass.constructor.apply(this, arguments);
         },

         execute: function(){
            var strategy;
            switch ( this._options.mode ){
               case 'DialogPanel':
                  strategy = new DialogStrategy();
                  break;
               case 'StackPanel':
                  strategy = new StackStrategy();
                  break;
               case 'StickyPanel':
                  strategy = new StickyStrategy(this._options);
                  break;
               case 'PushPanel':
                  strategy = new PushStrategy();
                  break;
            }
            PopupManager.show(this._options || {}, this, strategy);
         }
      });

      return OpenDialogAction;
   }
);