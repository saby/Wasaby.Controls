define('Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Core/moduleStubs',
      'css!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
   ],
   function(Control,
      template,
      moduleStubs) {
      /**
       * Слой совместимости для открытия старых шаблонов в новых попапах
      **/
      var CompoundArea = Control.extend({
         _template: template,
         componentOptions: null,
         compatible: null,
         fixBaseCompatible: true,
         _templateComponent: undefined,
         _beforeMount: function() {
            this._commandHandler = this._commandHandler.bind(this);
         },

         shouldUpdate: function() {
            return false;
         },

         _afterMount: function() {
            var
               self = this;
            if (this._options.componentOptions) {
               this.componentOptions = this._options.componentOptions;
            } else {
               this.componentOptions = {};
            }
            moduleStubs.require(['cdn!jquery/3.3.1/jquery-min.js', 'Core/constants']).addCallback(function(result) {
               var constants = result[1];

               if (window && window.$) {
                  result[1].$win = $(window);
                  result[1].$doc = $(document);
                  result[1].$body = $('body');
               }
               moduleStubs.require(
                  [
                     self._options.component,
                     'Lib/Control/Control.compatible',
                     'Lib/Control/AreaAbstract/AreaAbstract.compatible',
                     'Lib/Control/BaseCompatible/BaseCompatible',
                     'Core/vdom/Synchronizer/resources/DirtyCheckingCompatible',
                     'View/Runner/Text/markupGeneratorCompatible'
                  ]).addCallback(function(result) {
                  var tempCompatVal = constants.compat;
                  constants.compat = true;

                  var elem = $(self._children.compoundBlock);

                  self.componentOptions.element = elem;

                  self._compoundControl = new (result[0])(self.componentOptions);

                  self._subscribeToCommand();

                  constants.compat = tempCompatVal;
               });

               (function($) {
                  $.fn.wsControl = function() {
                     var control = null,
                        element;
                     try {
                        element = this[0];
                        while (element) {
                           if (element.wsControl) {
                              control = element.wsControl;
                              break;
                           }
                           element = element.parentNode;
                        }
                     } catch (e) {}
                     return control;
                  };
               })(jQuery);
            });

         },
         _subscribeToCommand: function() {
            this._compoundControl.subscribe('onCommandCatch', this._commandHandler);
         },
         _commandHandler: function(event, commandName) {
            switch (commandName) {
               case 'close':
                  this._close();
            }
         },
         _close: function() {
            this._notify('close');
         }
      });

      return CompoundArea;
   });
