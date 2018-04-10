define('SBIS3.CONTROLS/StylesPanelNew', [
   'SBIS3.CONTROLS/StylesPalette',
   'SBIS3.CONTROLS/Mixins/PopupMixin',
   'css!SBIS3.CONTROLS/StylesPanelNew/StylesPanelNew'
], function(StylesPalette, PopupMixin) {
   'use strict';

   /**
    * Панель выбора цвета с возможностью выбора цвета, начертания шрифта, установки предвыбранных стилей и сохранения истории
    *
    * @class SBIS3.CONTROLS/StylesPanelNew
    * @extends SBIS3.CONTROLS/StylesPalette
    * @control
    * @author Крайнов Д.О.
    * @mixes SBIS3.CONTROLS/Mixins/PopupMixin
    * @public
    */

   var StylesPanel = StylesPalette.extend([PopupMixin], /** @lends SBIS3.CONTROLS/StylesPanelNew.prototype */ {
      $protected: {
         _options: {
            addingClass: 'controls-StylesPanelNew',
            closeButton: true,
            closeByExternalClick: true
         },
         _pickerOpenHandler: undefined
      },
      $constructor: function () {
         if (this._options.paletteRenderStyle) {
            $('.controls-PopupMixin__closeButton', this.getContainer()).addClass('ws-hidden');
         }
      },

      init: function() {
         var self = this;

         StylesPanel.superclass.init.call(this);
         if (!self._options.paletteRenderStyle) {
            self._pickerOpenHandler = function() {
               self._size._picker._container.on('mousedown focus', self._blockFocusEvents);
            }.bind(self);
            //TODO: наилютейший костыль чтобы combobox не брал на себя фокус при открытии/закрытии popup`a
            self._size._scrollToItem = function(){};
            self._size.setActive = function(){};
            self._size.once('onPickerOpen', self._pickerOpenHandler);
         }

         this.subscribe('onClose', this.onClose.bind(this));
      },

      onClose: function() {
         if (this._options.instantFireMode === true && this._getInlineStyle(this._backup) !== this._getInlineStyle(this._currentStyle)) {
            this.setInlineStyle(this._getInlineStyle(this._backup));
         }
      },

      destroy: function() {
         StylesPanel.superclass.destroy.apply(this, arguments);
         if (!this._options.paletteRenderStyle) {
            this._size.unsubscribe('onPickerOpen', this._pickerOpenHandler);
         }
      },

      saveHandler: function() {
         StylesPanel.superclass.saveHandler.apply(this, arguments);
         this.hide();
      }
   });

   return StylesPanel;

});
