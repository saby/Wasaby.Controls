define('js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Writer', [
   'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Entities',
], function(Entities) {
   return function() {
      var html = [], encode;
      encode = Entities.getEncodeFunc('named');
      return {
         start: function(name, attrs, empty) {
            var i, l, attr;
            html.push('<', name);
            if (attrs) {
               for (i = 0, l = attrs.length; i < l; i++) {
                  attr = attrs[i];
                  html.push(' ', attr.name, '="', encode(attr.value, true), '"');
               }
            }
            if (!empty) {
               html[html.length] = '>';
            } else {
               html[html.length] = ' />';
            }
         },
         end: function(name) {
            html.push('</', name, '>');
         },
         text: function(text, raw) {
            if (text.length > 0) {
               html[html.length] = raw ? text : text;
            }
         },
         cdata: function(text) {
            html.push('<![CDATA[', text, ']]>');
         },
         comment: function(text) {
            html.push('<!--', text, '-->');
         },
         pi: function(name, text) {
            if (text) {
               html.push('<?', name, ' ', encode(text), '?>');
            } else {
               html.push('<?', name, '?>');
            }
         },
         doctype: function(text) {
            html.push('<!DOCTYPE', text, '>', '');
         },
         reset: function() {
            html.length = 0;
         },
         getContent: function() {
            return html.join('').replace(/\n$/, '');
         }
      };
   };
});