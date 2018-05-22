define('SBIS3.CONTROLS/Spoiler', [
   'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
   'SBIS3.CONTROLS/Mixins/Expandable',
   'SBIS3.CONTROLS/Utils/TemplateUtil',
   'tmpl!SBIS3.CONTROLS/Spoiler/Spoiler',
   'tmpl!SBIS3.CONTROLS/Spoiler/resources/LeftPartTitleTemplate',
   'tmpl!SBIS3.CONTROLS/Spoiler/resources/MiddlePartTitleTemplate',
   'SBIS3.CONTROLS/Utils/Contains',
   'css!SBIS3.CONTROLS/Spoiler/Spoiler',
   'i18n!SBIS3.CONTROLS/Spoiler'
], function(WSButtonBase, Expandable, TemplateUtil, dotTplFn, LeftPartTitleTemplate, MiddlePartTitleTemplate, contains) {

   'use strict';

    var findControlsInContainer = function(container) {
        var controls = [];
        $('[data-component]', container).each(function (idx, item) {
            var inst = item.wsControl;
            if (inst) {
                controls.push(inst);
            }
        });
        return controls;
    };

   /**
    * Класс контрола "Спойлер". Отображает переключаемую область (спойлер). Длинный заголовок спойлера по умолчанию обрезается.
    * @class SBIS3.CONTROLS/Spoiler
    * @extends WSControls/Buttons/ButtonBase
    * @mixes SBIS3.CONTROLS/Mixins/Expandable
    *
	* @demo Examples/Spoiler/MySpoiler/MySpoiler
    *
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS/Spoiler'>
    *    <option name='caption' value='Спойлер'></option>
    * </component>
    * @public
    * @category Button
    *
    * @author Авраменко А.С.
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
   var Spoiler = WSButtonBase.extend([Expandable], /** @lends SBIS3.CONTROLS/Spoiler.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            escapeCaptionHtml: false,
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
             * В контексте шаблона доступны все опции класса {@link SBIS3.CONTROLS/Spoiler}.
             * @see contentTpl
             * @see middlePartTitleTpl
             * @see rightPartTitleTpl
             */
            leftPartTitleTpl: '',
            /**
             * @cfg {String} Шаблон центральной части заголовка спойлера.
             * @remark
             * В контексте шаблона доступны все опции класса {@link SBIS3.CONTROLS/Spoiler}.
             * По умолчанию в этом шаблоне описана кнопка, клик по которой открывает/закрывает переключаемую область спойлера.
             * @see contentTpl
             * @see leftPartTitleTpl
             * @see rightPartTitleTpl
             */
            middlePartTitleTpl: '',
            /**
             * @cfg {String} Шаблон правой части заголовка спойлера.
             * @remark
             * В контексте шаблона доступны все опции класса {@link SBIS3.CONTROLS/Spoiler}.
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
         this._getCaptionContainer().toggleClass('controls-Spoiler__emptyCaption', !caption);
         this._getTextContainer().text(caption || '\xa0'); // \xa0 = &nbsp;
      },
      _getTitleContainer: function() {
         return $('.js-controls-Spoiler__title', this._container.get(0));
      },
      _getCaptionContainer: function() {
         return $('.js-controls-Spoiler__title-caption', this._container.get(0));
      },
      _getTextContainer: function() {
         return $('.js-controls-Spoiler__title-caption-text', this._container.get(0));
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
         findControlsInContainer(this._getContentContainer()).forEach(function(item) {
            item.destroy();
         });
         this._getContentContainer().get(0).innerHTML = '';
      },
      _notifyOnActivated: function(originalEvent){
         var
            titleContainer = this._getTitleContainer()[0];
         Spoiler.superclass._notifyOnActivated.apply(this, arguments);
         if (contains(titleContainer, originalEvent.target)) {
            this.toggleExpanded();
         }
      }
   });
   return Spoiler;
});
