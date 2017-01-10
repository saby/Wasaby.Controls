define('js!SBIS3.CONTROLS.BackButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.BackButton','js!SBIS3.CONTROLS.Link', 'css!SBIS3.CONTROLS.BackButton'], function(CompoundControl, dotTpl) {
   'use strict';
   /**
    * Кнопка для реализации поведения возврата назад по истории.
    * Пример использования - иерархические реестры
    * @class SBIS3.CONTROLS.BackButton
    * @extends $ws.proto.CompoundControl
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyBackButton
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
    * @control
    * @public
    * @category Navigation
    * @initial
    * <component data-component='SBIS3.CONTROLS.BackButton'>
    *    <option name="caption">Назад</option>
    * </component>
    */
   var BackButton = CompoundControl.extend( /** @lends SBIS3.CONTROLS.BackButton.prototype */ {
      _dotTplFn: dotTpl,
      /**
       * @event onActivated При активации кнопки (клик мышкой, кнопки клавиатуры)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
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
            href: ''
         }
      },

      init: function(){
         this._publish('onActivated', 'onArrowActivated');
         BackButton.superclass.init.call(this);
         this._container.removeClass('ws-area');
         var self = this;
         this._link = this.getChildControlByName('BackButton-caption');
         // Две подписки сделаны для того что бы в тестах можно было стриггерить событие нажатия
         // Клик по Link не проходит и сделан для того что бы можно было кликнуть по стрелке
         this._container.on('click', function(e){
            if ($(e.target).hasClass('controls-BackButton__arrow')){
               self._notify('onArrowActivated');
               e.stopPropagation();
            } else {
               self._notify('onActivated');
            }
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

      /**
       * Устанавливает текст кнопки
       * @param caption Текси
       */
      setCaption: function(caption){
         this._link.setCaption(caption);
         this.setTooltip(caption);
         this._options.caption = caption;
         this._container.toggleClass('controls-BackButton__empty', !caption);
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