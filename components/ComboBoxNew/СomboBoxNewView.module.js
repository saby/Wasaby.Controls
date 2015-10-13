/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.ComboBoxNewView', [
], function () {
   'use strict';
   /**
    * Представление для комбобокса
    * @class SBIS3.CONTROLS.ComboBoxView
    * @extends SBIS3.CONTROLS.ListControl.ListView
    * @public
    * @author Ганшин Ярослав Олегович
    */
   return $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.ComboBoxView.prototype */{
      /**
       * @event onClickToArrow Уведомляет о клике по стрелке внутри комбобкса
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      $protected: {
      },
      $constructor: function() {
         this._publish('onClickToArrow');
         var self = this,
            rootNode = this._options.rootNode;
         rootNode.addClass('controls-ComboBox');
         rootNode.mouseup(function (e) {
            if ($(e.target).hasClass('js-controls-ComboBox__arrowDown') || $(e.target).hasClass('controls-TextBox__afterFieldWrapper')) {
               self._notify('onClickToArrow');
            }
         });
      },
      drawNotEditablePlaceholder: function(text) {
         $('.js-controls-ComboBox__fieldNotEditable', this.getRootNode()).toggleClass('controls-ComboBox__fieldNotEditable__placeholder', !text);
      },
      setText: function(text) {
         this.drawNotEditablePlaceholder(text);
         $('.js-controls-ComboBox__fieldNotEditable', this.getRootNode()).text(text || this._options.placeholder);
      },
      setEditable: function(editable) {
         this.getRootNode().toggleClass('controls-ComboBox__editable-false', editable === false);
      },
      getRootNode: function(){
         return this._options.rootNode;
      }
   });
});
