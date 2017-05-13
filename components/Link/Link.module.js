define('js!SBIS3.CONTROLS.Link', [
   'Deprecated/helpers/string-helpers',
   'js!WSControls/Buttons/Button',
   'tmpl!SBIS3.CONTROLS.Link/resources/hrefTemplate',
   'css!SBIS3.CONTROLS.Link'
], function(strHelpers, WSButton, hrefTemplate) {

   'use strict';

   /**
    * Класс контрол "Кнопка в виде ссылки". Используется только в онлайн.
    *
    * @class SBIS3.CONTROLS.Link
    * @extends WSControls/Buttons/ButtonBase
    * @author Крайнов Дмитрий Олегович
    *
    * @demo SBIS3.CONTROLS.Demo.MyLink
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
    * @css controls-Link__icon Класс для изменения отображения иконки кнопки.
    *
    * @cssModifier controls-Button__ellipsis Устанавливает отображение многоточия в тексте кнопки при нехватке ширины.
    * !Важно: при добавлении этого модификатора сломается "Базовая линия".
    * @cssModifier controls-Link__disabledHover Отключает изменение цвета текста кнопки, которое происходит по наведению курсора.
    * @cssModifier controls-Link__underline Устанавливает постоянное подчеркивание текста кнопки.
    * @cssModifier mainLink__2 Устанавливает для кнопки стилевое оформление "Основная ссылка 2" (см. <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Кнопки-ссылки</a>).
    * @cssModifier additionalLink Устанавливает для кнопки стилевое оформление "Дополнительная ссылка" (см. <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Кнопки-ссылки</a>).
    * @cssModifier additionalLink__2 Устанавливает для кнопки стилевое оформление "Дополнительная ссылка 2" (см. <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Кнопки-ссылки</a>).
    * @cssModifier additionalLink__3 Устанавливает для кнопки стилевое оформление "Дополнительная ссылка 3" (см. <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Кнопки-ссылки</a>).
    * @cssModifier additionalLink__4 Устанавливает для кнопки стилевое оформление "Дополнительная ссылка 4" (см. <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Кнопки-ссылки</a>).
    * @cssModifier additionalLink__5 Устанавливает для кнопки стилевое оформление "Дополнительная ссылка 5" (см. <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Кнопки-ссылки</a>).
    *
    * @control
    * @public
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.Link'>
    *    <option name='caption' value='Ссылка'></option>
    * </component>
    */

   var Link = WSButton.extend( /** @lends SBIS3.CONTROLS.Link.prototype */ {
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

      _modifyOptions: function (opts) {
         var
             options = Link.superclass._modifyOptions.apply(this, arguments);
         options.cssClassName += ' controls-Link';

         // в случае когда задана ссылка передаем отдельный шаблон
         if(options.href) {
            options.contentTemplate = hrefTemplate;
         }else {
            options._textClass = ' controls-Link__field';
         }
         return options;
      },

      $constructor: function() {},

      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         if(this._options.href) {
            this._container.get(0).innerHTML = hrefTemplate(this._options);
         }
         this.setTooltip(strHelpers.htmlToText(caption));
      },

      _setEnabled: function(enabled){
         Link.superclass._setEnabled.apply(this, arguments);
         if (enabled) {
            if (this._options.href) {
               $('.controls-Link-link', this._container).attr('href', this._options.href);
            }
         }
         else {
            $('.controls-Link-link', this._container).removeAttr('href', this._options.href);
         }
      },

      _drawIcon: function (icon) {
         Link.superclass._drawIcon.call(this, icon);
         if(this._options.href) {
            this._container.get(0).innerHTML = hrefTemplate(this._options);
         }
      },
      /**
       * Установить ссылку.
       * Метод установки либо замены адреса, заданного опцией {@link href}.
       * @param href Сыылка.
       * @see href
       * @see inNewTab
       */
      setHref: function (href) {
         this._options.href = href;
         this._container.html(hrefTemplate(this._options));
      }

   });

   return Link;

});