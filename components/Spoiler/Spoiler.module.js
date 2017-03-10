define('js!SBIS3.CONTROLS.Spoiler', [
   'js!SBIS3.CONTROLS.ButtonBase',
   'js!SBIS3.CONTROLS.Expandable',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'tmpl!SBIS3.CONTROLS.Spoiler',
   'tmpl!SBIS3.CONTROLS.Spoiler/resources/LeftPartTitleTemplate',
   'tmpl!SBIS3.CONTROLS.Spoiler/resources/MiddlePartTitleTemplate',
   'Core/helpers/collection-helpers',
   'Core/helpers/dom&controls-helpers',
   'css!SBIS3.CONTROLS.Spoiler'
], function(ButtonBase, Expandable, TemplateUtil, dotTplFn, LeftPartTitleTemplate, MiddlePartTitleTemplate, colHelpers, dcHelpers) {

   'use strict';

   /**
    * Контрол, отображающий переключаемую область (спойлер).
    * @remark
    * Длинный заголовок спойлера по умолчанию обрезается.
    * @class SBIS3.CONTROLS.Spoiler
    * @extends SBIS3.CONTROLS.ButtonBase
    * @mixes SBIS3.CONTROLS.Expandable
    *
	 * @demo SBIS3.CONTROLS.Demo.MySpoiler
    *
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.Spoiler'>
    *    <option name='caption' value='Спойлер'></option>
    * </component>
    * @public
    * @category Buttons
    *
    * @author Авраменко Алексей Сергеевич
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
    * @ignoreOptions subcontrol verticalAlignment activateByClick
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    */
   var Spoiler = ButtonBase.extend([Expandable], /** @lends SBIS3.CONTROLS.Spoiler.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            /**
             * @noShow
             */
            expandedClassName: 'controls-Spoiler_expanded',
            /**
             * @cfg {String} Шаблон переключаемой области.
             * @remark
             * В контексте шаблона доступны все опции, которые переданые в объекте {@link properties}.
             * @see leftPartTitleTpl
             * @see middlePartTitleTpl
             * @see rightPartTitleTpl
             */
            contentTpl: '',
            /**
             * @cfg {String} Шаблон левой части заголовка спойлера.
             * @remark
             * В контексте шаблона доступны все опции класса {@link SBIS3.CONTROLS.Spoiler}.
             * @see contentTpl
             * @see middlePartTitleTpl
             * @see rightPartTitleTpl
             */
            leftPartTitleTpl: '',
            /**
             * @cfg {String} Шаблон центральной части заголовка спойлера.
             * @remark
             * В контексте шаблона доступны все опции класса {@link SBIS3.CONTROLS.Spoiler}.
             * По умолчанию в этом шаблоне описана кнопка, клик по которой открывает/закрывает переключаемую область спойлера.
             * @see contentTpl
             * @see leftPartTitleTpl
             * @see rightPartTitleTpl
             */
            middlePartTitleTpl: '',
            /**
             * @cfg {String} Шаблон правой части заголовка спойлера.
             * @remark
             * В контексте шаблона доступны все опции класса {@link SBIS3.CONTROLS.Spoiler}.
             * @see contentTpl
             * @see leftPartTitleTpl
             * @see middlePartTitleTpl
             */
            rightPartTitleTpl: '',
            /**
             * @cfg {Object} Набор опций, которые будут переданы в контекст шаблона {@link contentTpl}.
             * @see contentTpl
             */
            properties: null
         },
         _checkClickByTap: false
      },
      _modifyOptions: function(opts) {
         var
            opts = Spoiler.superclass._modifyOptions.apply(this, arguments);
         opts._contentTpl = TemplateUtil.prepareTemplate(opts.contentTpl);
         opts._leftPartTitleTpl = opts.leftPartTitleTpl ? TemplateUtil.prepareTemplate(opts.leftPartTitleTpl) : LeftPartTitleTemplate;
         opts._middlePartTitleTpl = opts.middlePartTitleTpl ? TemplateUtil.prepareTemplate(opts.middlePartTitleTpl) : MiddlePartTitleTemplate;
         opts._rightPartTitleTpl = opts.rightPartTitleTpl ? TemplateUtil.prepareTemplate(opts.rightPartTitleTpl) : false;
         return opts;
      },
      init: function() {
         this.subscribe('onExpandedChange', this._onExpandedChange);
         Spoiler.superclass.init.apply(this, arguments);
      },
      setCaption: function(caption){
         Spoiler.superclass.setCaption.call(this, caption);
         this._getTextContainer()
            .toggleClass('controls-Spoiler__emptyCaption', !caption)
            .text(caption || '');
      },
      _getTitleContainer: function() {
         return $('.js-controls-Spoiler__title', this._container.get(0));
      },
      _getTextContainer: function() {
         return $('.js-controls-Spoiler__title-caption', this._container.get(0));
      },
      _getContentContainer: function() {
         return $('.js-controls-Spoiler__content', this._container.get(0));
      },
      _getToggleItemContainer: function() {
         return $('.js-controls-Spoiler__toggle-item', this._container.get(0));
      },
      setEnabled: function(enabled){
         Spoiler.superclass.setEnabled.call(this, enabled);
         this._container.attr('disabled', !this.isEnabled());
      },
      _onExpandedChange: function(event, expanded) {
         this._getToggleItemContainer().toggleClass('icon-CollapseLight', expanded).toggleClass('icon-ExpandLight', !expanded);
         if (expanded) {
            this._initializeContent();
         } else {
            this._destroyContent();
         }
      },
      _initializeContent: function() {
         this._getContentContainer().html(this._options._contentTpl(this._options));
         this.reviveComponents();
      },
      _destroyContent: function() {
         colHelpers.forEach(dcHelpers.findControlsInContainer(this._getContentContainer()), function(item) {
            item.destroy();
         });
         dcHelpers.clearContainer(this._getContentContainer());
      },
      _notifyOnActivated: function(originalEvent){
         var
            titleContainer = this._getTitleContainer()[0];
         Spoiler.superclass._notifyOnActivated.apply(this, arguments);
         if (originalEvent.target === titleContainer || dcHelpers.contains(titleContainer, originalEvent.target)) {
            this.toggleExpanded();
         }
      }
   });
   return Spoiler;
});