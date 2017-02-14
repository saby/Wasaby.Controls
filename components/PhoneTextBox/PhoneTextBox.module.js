define('js!SBIS3.CONTROLS.PhoneTextBox', ['js!SBIS3.CONTROLS.FormattedTextBox', 'html!SBIS3.CONTROLS.PhoneTextBox', 'css!SBIS3.CONTROLS.PhoneTextBox'], function(FormattedTextBoxBase, dotTpl) {

   'use strict';

   /**
    * Класс контрола, отображающий ссылку, при нажатии на которую произойдет звонок.
    * @class SBIS3.CONTROLS.PhoneTextBox
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @cssModifier controls-Button__ellipsis При нехватке ширины текст на кнопке оборвётся многоточием.
    * !Важно: при добавлении этого класса сломается "Базовая линия".
    *
    * @css controls-Link__icon Класс для изменения отображения иконки кнопки.
    *
    * @public
    * @control
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.PhoneCall'>
    *    <option name='caption' value='Позвонить Гене'></option>
    *    <option name='number' value='8(800)200-600'></option>
    * </component>
    */
   var getSrcText = function(fullText) {
      var digits = fullText.replace(/[^0-9]/g, '');
      digits = '+' + digits;
      return digits;
   },

   getFullText = function(srcText, model) {
      var item, fullText = '';
      if (srcText.charAt(0) == '+') {
         srcText = srcText.substring(1);
      }
      for (var i = 0; i < model.length; i++) {
         item = model[i];
         if (item.isGroup) {
            fullText += srcText.substr(0, item.innerMask.length);
            srcText = srcText.substring(item.innerMask.length);
         } else {
            fullText += item.innerMask;
         }
      }
      return fullText;
   };

   var PhoneTextBox = FormattedTextBoxBase.extend( /** @lends SBIS3.CONTROLS.PhoneTextBox.prototype */ {
      _dotTplFn: dotTpl,
      $protected: {
         _options: {
            srcText: undefined,
            mask: '+d(ddd)ddd-dd-dd'
         }
      },

      _modifyOptions : function(cfg) {


         if (cfg.srcText) {
            var formatModel = cfg._createModel(cfg._controlCharactersSet, cfg.mask);
            cfg.text = getFullText(cfg.srcText, formatModel.model);
            if (cfg.srcText.charAt(0) != '+') {
               cfg.srcText = '+' + cfg.srcText;
            }
         }
         else {
            if (cfg.text) {
               cfg.srcText = getSrcText(cfg.text);
            }
         }
         var newCfg = PhoneTextBox.superclass._modifyOptions.apply(this, arguments);

         return newCfg;
      },

      _setEnabled: function(state) {
         PhoneTextBox.superclass._setEnabled.apply(this, arguments);
         $('.js-controls-FormattedTextBox__field', this._container.get(0)).toggleClass('ws-hidden', !state);
         $('.controls-PhoneTextBox__link', this._container.get(0)).toggleClass('ws-hidden', state);
      },

      _updateText: function() {
         PhoneTextBox.superclass._updateText.apply(this, arguments);
         this._options.srcText = getSrcText(this.getText());
         $('.controls-PhoneTextBox__link', this._container.get(0))
            .text(this.getText())
            .attr('href', 'tel:' + this._options.srcText);
      },

      getSrcText: function() {
         return this._options.srcText;
      },

      setSrcText: function(srcText) {
         this._options.srcText = srcText;
         this.setText(getFullText(srcText, this._getFormatModel().model));
      }
   });

   return PhoneTextBox;

});