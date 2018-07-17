define('SBIS3.CONTROLS/Button/BackButton',
   [
    'Lib/Control/CompoundControl/CompoundControl',
    'Core/helpers/String/escapeTagsFromStr',
    'tmpl!SBIS3.CONTROLS/Button/BackButton/BackButton',
    'SBIS3.CONTROLS/Link',
    'css!SBIS3.CONTROLS/Button/BackButton/BackButton'
   ],
    function(CompoundControl, escapeTagsFromStr, dotTpl) {
   'use strict';
   /**
    * Класс контрола "Кнопка "Назад".
    * Применяется для реализации поведения возврата назад по истории переходов. Пример использования - иерархические реестры.
    * @class SBIS3.CONTROLS/Button/BackButton
    * @extends Lib/Control/CompoundControl/CompoundControl
    * @author Герасимов А.М.
    * @demo Examples/BackButton/MyBackButton/MyBackButton
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
    *
    * @css controls-BackButton__orange Устанавливает стилевое оформление, при котором надпись кнопки будет орандевого цвета (#D94700), а символ стрелки "Назад" синего (#313E78) (см. <a href="http://axure.tensor.ru/standarts/v7/#p=разделители__заголовки___версия_05_">Стандарты</a>).
    *
    * @control
    * @public
    * @category Navigation
    * @initial
    * <component data-component='SBIS3.CONTROLS/Button/BackButton'>
    *    <option name="caption">Назад</option>
    * </component>
    */
   var BackButton = CompoundControl.extend( /** @lends SBIS3.CONTROLS/Button/BackButton.prototype */ {
      _dotTplFn: dotTpl,
      /**
       * @event onActivated При активации кнопки (клик мышкой, кнопки клавиатуры)
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    onActivated: function(event){
       *       $ws.helpers.question('Продолжить?');
       *    }
       * </pre>
       */
      $protected: {

         _link: null,
         _options:{
            /**
             * @cfg {String} Устанавливает надпись на кнопке.
             * Надпись должна отображать смысл действия клика по кнопке или побуждать к действию.
             * @example
             * <pre class="brush: xml">
             *    <option name="caption">Вернуться</option>
             * </pre>
             * @translatable
             */ 
            caption: '',
            /**
             * @cfg {String} Устанавливает изображение иконки на кнопке.
             * @example
             * <pre class="brush: xml">
             *    <option name="icon">sprite:icon-16 icon-Arrow1730 icon-primary</option>
             * </pre>
             * @see setIcon
             */
            icon: '',
            /**
             * @cfg {String} Устанавливает ссылку на кнопке.
             * @example
             * <pre class="brush: xml">
             *    <option name="href">http://inside.tensor.ru</option>
             * </pre>
             * @see setHref
             */
            href: '',

            /**
             * @cfg {String} Устанавливает цвет кнопки назад в виде заголовка.
             * @variant accent1
             * @variant accent2
             */
            style: 'default-backButton',
            /**
             * @cfg {String} Устанавливает размер кнопки назад в виде заголовка.
             * @variant h2
             * @variant h3
             * @variant h6
             */
            size: 'default-backButton'
         }
      },

      init: function(){
         this._publish('onActivated', 'onArrowActivated');
         BackButton.superclass.init.call(this);
         
         var self = this;
         this._link = this.getChildControlByName('BackButton-caption');
         // Две подписки сделаны для того что бы в тестах можно было стриггерить событие нажатия
         // Клик по Link не проходит и сделан для того что бы можно было кликнуть по стрелке
         this._container.on('click', function(e){
            if (!$(e.target).hasClass('controls-BackButton__arrow')) {
               self._notify('onActivated');
               if (!!self._options.command && self.isEnabled()) {
                  var args = [self._options.command].concat(self._options.commandArgs);
                  self.sendCommand.apply(self, args);
               }
            }
         });
         
         this.subscribeTo(this.getChildControlByName('BackButton-arrow'), 'onActivated', function() {
            self._notify('onArrowActivated');
         });
         this._link.subscribe('onActivated', function(){
            self._notify('onActivated');
         });
      },


      getCaption: function(){
         return this._options.caption;
      },

      getHref: function(){
         return this._options.href;
      },

      setEscapeCaptionHtml: function (escapeHtml) {
         this._link.setProperty('escapeCaptionHtml', escapeHtml);
      },

      getEscapeCaptionHtml: function () {
         return this._link.getProperty('escapeCaptionHtml');
      },

      /**
       * Устанавливает текст кнопки
       * @param caption Текси
       */
      setCaption: function(caption){
         var isEmptyCaption = (caption === null || caption === '' || typeof caption === 'undefined');
         this._link.setCaption(caption);

         var tooltip = caption || '';
         if (this._options.escapeCaptionHtml === false) {
            //если подразумевается что в кнопке может быть верстка (как в сотрудниках, то вырезаем теги)
            tooltip = escapeTagsFromStr((caption || '').replace(/<br>/g, '\n'), '\\w+');
         }

         this.setTooltip(tooltip);
         this._options.caption = caption;
         this._container.toggleClass('controls-BackButton__empty', isEmptyCaption);
      },
      /**
       * Устанавливает изображение иконки кнопки.
       * @param icon Изображение иконки.
       */
      setIcon: function(icon){
         this._link.setIcon(icon);
         this._options.icon = icon;
      },
      /**
       * Устанавливает ссылку кнопки
       * @param href Ссылка для перехода по клику
       */
      setHref: function(href){
         this._link.setHref(href);
         this._options.href = href;
      },
      setTooltip: function(tooltip) {
         this._link.setTooltip.apply(this._link, arguments);
         BackButton.superclass.setTooltip.apply(this, arguments);
      }
   });

   return BackButton;
});
