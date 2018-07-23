/**
 * Created by rn.kondakov on 23.07.2018.
 */
define('SBIS3.CONTROLS/JsonRichEditor', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/JsonRichEditor/JsonRichEditor',
   'Core/HtmlJson',
   'Core/helpers/domToJsonML'
], function(
   CompoundControl,
   dotTplFn,
   HtmlJson,
   domToJsonML
) {
   'use strict';

   var JsonRichEditor = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $private: {
         _htmlJson: undefined
      },
      $constructor: function() {
         this._htmlJson = new HtmlJson();
      },
      init: function() {
         var self = this;
         JsonRichEditor.superclass.init.call(self, arguments);
         self.setJson(self._options.json);

         this.getChildControlByName('richEditor').subscribe('onTextChange', function(e, text) {
            var div = document.createElement('div');
            div.innerHTML = text;
            self._options.json = domToJsonML(div).slice(1);
            self._notify('onJsonChange', self._options.json);
         });
      },

      setJson(json) {
         this._options.json = json;
         this._htmlJson._options.json = json;
         this.getChildControlByName('richEditor').setText(this._htmlJson.render());
      }
   });

   return JsonRichEditor;
});
