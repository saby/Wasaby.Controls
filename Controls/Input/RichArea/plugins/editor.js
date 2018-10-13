define('Controls/Input/RichArea/plugins/editor', [],
   function() {
      /**
       * Модуль-хэлпер для tinyMce редактора работающего с БТР
       */

      var EditorPlugin = {

         /**
          * Function returns clear editor value
          * @param self
          */
         getEditorValue: function(self) {
            var
               content = self._editor.getContent({ no_events: true }),
               args = self._editor.fire('PostProcess', { content: content });

            return args.content;
         }
      };

      return EditorPlugin;
   });
