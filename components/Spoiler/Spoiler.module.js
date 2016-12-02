define('js!SBIS3.CONTROLS.Spoiler', [
   'js!SBIS3.CONTROLS.ButtonBase',
   'js!SBIS3.CONTROLS.Expandable',
   'js!SBIS3.CORE.MarkupTransformer',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'tmpl!SBIS3.CONTROLS.Spoiler',
   'tmpl!SBIS3.CONTROLS.Spoiler/resources/LeftPartTitleTemplate',
   'tmpl!SBIS3.CONTROLS.Spoiler/resources/MiddlePartTitleTemplate',
   'Core/helpers/dom&controls-helpers'
], function(ButtonBase, Expandable, MarkupTransformer, TemplateUtil, dotTplFn, LeftPartTitleTemplate, MiddlePartTitleTemplate, dcHelpers) {

   'use strict';

   /**
    * Контрол, отображающий переключаемую область (спойлер)
    * @class SBIS3.CONTROLS.Spoiler
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
	 * @demo SBIS3.CONTROLS.Demo.MySpoiler
    * @initial
    * <component data-component='SBIS3.CONTROLS.Spoiler'>
    *    <option name='caption' value='Спойлер'></option>
    * </component>
    * @public
    * @category Buttons
    * @author Авраменко Алексей Сергеевич
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
    * @ignoreOptions subcontrol verticalAlignment
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
            expandedClassName: 'controls-Spoiler_expanded',
            contentTpl: '',
            leftPartTitleTpl: '',
            middlePartTitleTpl: '',
            rightPartTitleTpl: '',
            properties: null
         },
         _checkClickByTap: false,
         _contentInitialized: false
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
         if (this.isExpanded()) {
            this._contentInitialized = true;
         }
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
         if (expanded && !this._contentInitialized) {
            this._initializeContent();
         }
      },
      _initializeContent: function() {
         this._getContentContainer().html(MarkupTransformer(this._options._contentTpl(this._options)));
         this.reviveComponents();
         this._contentInitialized = true;
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