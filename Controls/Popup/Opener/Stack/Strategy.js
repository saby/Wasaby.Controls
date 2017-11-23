define('js!Controls/Popup/Opener/Stack/Strategy',
   [
      'Core/Abstract',
      'js!Controls/Popup/interface/IStrategy',
      'Core/core-instance'
   ],
   function (Abstract, IStrategy, CoreInstance) {

      /**
       * Стратегия позиционирования окна.
       * @class Controls/Popup/Opener/Stack/Strategy
       * @mixes Controls/Popup/interface/IStrategy
       * @control
       * @public
       * @category Popup
       */
      var Strategy = Abstract.extend([IStrategy], {
         _opener: undefined,
         _panelOpener: undefined,

         constructor: function (cfg, opener) {
            Strategy.superclass.constructor.call(this, cfg);
            this._options = cfg;
            this._opener = opener;
            this._panelOpener = this._getOpenerPanel();
         },

         getPosition: function (popup) {
            var
               right = 0;
            if( this._panelOpener ){
               if( this._panelOpener.isStack() ){
                  right += this._panelOpener.getStrategy().getPosition().right + 100;
               }
            }
            return {
               top: 0,
               bottom: 0,
               right: right
            }
         },

         getOpener: function(){
            return this._opener;
         },

         _getOpenerPanel: function(){
            var parent = this._opener;
            while( !CoreInstance.instanceOfModule(parent, 'Controls/Popup/Manager/Popup') && !!parent ){
               parent = parent.getParent();
            }
            return parent;
         }
      });

      return Strategy;
   }
);