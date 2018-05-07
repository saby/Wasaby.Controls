define('Controls/Popup/Сompatible/CompoundArea/CompoundArea',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Сompatible/CompoundArea/CompoundArea',
      'Core/Deferred',
      'Core/moduleStubs',
      'css!Controls/Popup/Сompatible/CompoundArea/CompoundArea',
      'css!Controls/Popup/Templates/Stack/StackTemplate'
   ],
   function(Control,
      template,
      Deferred,
      moduleStubs) {
      /**
       * Слой совместимости для открытия старых шаблонов в новых опенерах
      **/
      var CompoundArea = Control.extend({
         _template: template,
         componentOptions: null,
         compatible: null,
         fixBaseCompatible: true,
         _templateComponent: undefined,
         _beforeMount: function(cfg) {
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
            moduleStubs.require([/*'cdn!jquery/3.3.1/jquery-min.js',*/ 'Core/constants']).addCallback(function(result) {
               if (window && window.$) {
                  result[0].$win = $(window);
                  result[0].$doc = $(document);
                  result[0].$body = $('body');
               }
               moduleStubs.require(
                  [
                     self._options.component,
                     'Lib/Control/Control.compatible',
                     'Lib/Control/AreaAbstract/AreaAbstract.compatible',
                     'Lib/Control/BaseCompatible/BaseCompatible',
                     'Core/vdom/Synchronizer/resources/DirtyCheckingCompatible'
                  ]).addCallback(function(result) {

                  var ignore = ['_forceUpdate', '_getMarkup', '_notify'];

                  for (var i in result[1]) {
                     if (ignore.indexOf(i) == -1) {
                        self[i] = result[1][i];
                     }
                  }
                  for (var i in result[2]) {
                     if (ignore.indexOf(i) == -1) {
                        self[i] = result[2][i];
                     }
                  }
                  for (var i in result[3]) {
                     if (ignore.indexOf(i) == -1) {
                        self[i] = result[3][i];
                     }
                  }

                  self.VDOMReady = true;
                  self.deprecatedContr(self._options);
                  self.reviveSuperOldControls();

                  self._subscribeToCommand();
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
            this._templateComponent = this.getChildControls(undefined, false)[0];
            this._templateComponent.subscribe('onCommandCatch', this._commandHandler);

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
