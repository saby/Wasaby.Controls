define('Controls/Input/RichArea/helpers/editor', [
],
function() {
   /**
       * Module which provide work tinymce instance with TinyMCE
       */

   var EditorHelper = {

      /**
          * Function returns clear editor value
          * @param self
          */
      getEditorValue: function(self) {
         var
            content = self._editor.getContent({ no_events: true }),
            args = self._editor.fire('PostProcess', { content: content });

         return args.content;
      },

      /**
          * Function exec command to editor
          * @param self
          * @param commandName
          * @param userInterface
          * @param properties
          */
      execCommand: function(self, commandName, userInterface, properties) {
         var commandCallbacks = [];

         switch (commandName) {
            case 'JustifyLeft':
            case 'JustifyRight':
            case 'JustifyCenter':
            case 'JustifyFull':
               _private.alignmentPreparation(self, commandName);
               break;
            case 'mceBlockquote':
               _private.blockquotePrepararation(self, commandCallbacks);
         }

         self._editor.execCommand(commandName, userInterface, properties);
         self._handlers.inputHandler();

         if (commandCallbacks.length) {
            commandCallbacks.forEach(function(callbackFunc) {
               callbackFunc();
            });
         }
      },

      /**
          * Function applies format to selected text
          * @param self
          * @param formatName
          * @param state
          */
      applyFormat: function(self, formatName, state) {
         self._editor.formatter.apply(formatName, { value: state || true });
         self._handlers.inputHandler();
      },

      /**
          * Function removes format from selected text
          * @param self
          * @param formatName
          */
      removeFormat: function(self, formatName) {
         self._editor.formatter.remove(formatName);
         self._handlers.inputHandler();
      },

      /**
          * Function return editor selection
          * @param self
          * @returns {*}
          */
      getSelection: function(self) {
         return self._editor.selection;
      },

      /**
          * Function insert html-string into current cursor position
          * @param self - context
          * @param html
          */
      insertHtml: function(self, html) {
         self._editor.insertContent(this.prepareContent(html));
         self._handlers.inputHandler();
      },

      /**
          * Function insert link into current cursor position
          * @param self
          * @param link
          * @param name
          */
      insertLink: function(self, link, name) {
         var
            editor = self._editor,
            selection = this.getSelection(self),
            currentNode = selection.getNode(),
            dom = self._editor.dom;

         if (currentNode.nodeName === 'A') {
            currentNode.setAttribute('href', link);
            currentNode.innerHTML = name;
         } else if (selection.getContent() === '') {
            var newNode = dom.createHTML('a', { href: link }, name);
            editor.insertContent(newNode);
         } else {
            this.execCommand(self, 'mceInsertLink', false, { href: link });
         }
         self._handlers.inputHandler();
      },

      /**
          * Function unwrap target node
          * @param target
          */
      unwrap: function(target) {
         var parent = target.parentNode;
         while (target.firstChild) {
            parent.insertBefore(target.firstChild, target);
         }
         parent.removeChild(target);
      },

      /**
          * Function wrap node
          * @param el
          * @param wrapper
          */
      wrap: function(el, wrapper) {
         el.parentNode.insertBefore(wrapper, el);
         wrapper.appendChild(el);
      }
   };

   var _private = {

      /**
          * Function fixes a problem that appearing when user trying to align list's elements
          * @param self
          * @param commandName
          */
      alignmentPreparation: function(self, commandName) {
         var
            selection = EditorHelper.getSelection(self),
            currentNode = selection.getNode(),
            list = currentNode.querySelectorAll('ol, ul');

         if (!list.length && currentNode.closest('ol, ul')) {
            list = [currentNode.closest('ol, ul')];
         }

         if (list.length) {
            for (var i = 0, len = list.length; i < len; i++) {
               list[i].style['list-style-position'] = (commandName === 'JustifyRight' || commandName === 'JustifyCenter') ? 'inside' : '';
            }
         }
      },

      /**
          * Function fixes a problem that appearing when user trying to wrap lists in quote
          * @param self
          * @param commandCallbacks
          */
      blockquotePrepararation: function(self, commandCallbacks) {
         var
            selection = EditorHelper.getSelection(self),
            range = selection.getRng(),
            node = range.commonAncestorContainer;

         if (node.nodeName === 'OL' || node.nodeName === 'UL') {
            EditorHelper.wrap(node, document.createElement('div'));
            selection.select(node.parentNode, false);
            node.setAttribute('contenteditable', false);
            commandCallbacks.push(function() {
               if (node.parentNode.nodeName !== 'BLOCKQUOTE') {
                  EditorHelper.unwrap(node);
               }
               node.removeAttribute('contenteditable');
               selection.select(node, true);
            });
         }
      }
   };

   return EditorHelper;
});
