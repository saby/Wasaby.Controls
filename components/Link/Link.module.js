define('js!SBIS3.CONTROLS.Link', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Link' ], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки. Используется только в онлайне.
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.CONTROLS.Link
	* @demo SBIS3.CONTROLS.Demo.MyLink
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.Link'>
    *    <option name='caption' value='Ссылка'></option>
    * </component>
    * @public
    * @author Крайнов Дмитрий Олегович
    * @category Buttons
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
    */

   var Link = ButtonBase.extend( /** @lends SBIS3.CONTROLS.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
             /**
              * @cfg {String} Адрес документа, к которому нужно перейти
              * @example
              * <pre>
              *     <option name="href">https://google.ru/</option>
              * </pre>
              * @see inNewTab
              */
            href: '',
             /**
              * @cfg {Boolean} Открывать ссылку в новой вкладке
              * @example
              * <pre>
              *     <option name="inNewTab">true</option>
              * </pre>
              * @see href
              */
            inNewTab: false
         }
      },

      $constructor: function() {
      },

      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         if (this._options.icon) {
            $('.controls-Link__field', this._container).html(caption);
         } else {
            this._container.html(caption);
         }
      },

      setEnabled: function(enabled){
          Link.superclass.setEnabled.apply(this, arguments);
          this._container.toggleClass('ws-hover-target', enabled);
      },

      setIcon: function(icon){
         Link.superclass.setIcon.call(this, icon);
         var content;
         if (icon) {
            content = $('<i class="controls-Link__icon ' + this._iconClass + '" ></i><span class="controls-Link__field">' + this._options.caption + '</span>');
         } else {
            content = this._options.caption;
         }
         this._container.html(content);
      },
       /**
        * Установить ссылку.
        * Метод установки либо замены адреса, заданного опцией {@link href}.
        * @param href Сыылка.
        * @see href
        * @see inNewTab
        */
      setHref: function(href){
         this._options.href = href;
         if (!href) {
            href = 'javascript:void(0);';
         } 
         this._container.attr('href', href);
      }

   });

   return Link;

});