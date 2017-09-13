define('js!WSControls/Containers/FloatAreaOpener',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!WSControls/Containers/FloatAreaOpener',
      'js!SBIS3.CORE.FloatArea'
   ],
   function(CompoundControl,
            template,
            FloatArea) {
      var FloatAreaOpener = CompoundControl.extend({
         _dotTplFn: template,

         init: function() {
            var self = this;
            FloatAreaOpener.superclass.init.apply(this, arguments);
            new FloatArea({
               opener: this,
               parent: this,
               template: 'js!WSControls/Containers/VDOMArea',
               handlers: {
                  onReady: function(){console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")},
                  onClose: function() { self._options.closeCallback() }
               },
               componentOptions: {
                  component: 'js!TestsPlatform/NewsFeed/NewsFeed',
                  componentOptions: {
                     caption: 'текст на кнопке'
                  }
               },
               autoHide: true,
               direction: 'left',
               isStack: true,
               side: 'right'
            })
         }
      });

      return FloatAreaOpener;
   });