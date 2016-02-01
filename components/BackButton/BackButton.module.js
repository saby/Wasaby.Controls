define('js!SBIS3.CONTROLS.BackButton', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.BackButton','js!SBIS3.CONTROLS.Link'], function(CompoundControl, dotTpl) {
   'use strict';
   /**
    * Кнопка для реализации поведения возврата назад по истории.
    * Пример использования - иерархические реестры
    * @class SBIS3.CONTROLS.BackButton
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @demo SBIS3.CONTROLS.Demo.MyBackButton
    * @initial
    * <component data-component='SBIS3.CONTROLS.BackButton'>
    *    <option name="caption">Назад</option>
    * </component>
    * @category Buttons
    * @author Крайнов Дмитрий Олегович
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
    */
   var BackButton = CompoundControl.extend({
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
             * @cfg {String} Надпись
             * @translatable
             */ 
            caption: '',
            /**
             * @cfg {String} спрайт иконки
             */
            icon: ''
         }
      },

      init: function(){
         this._publish('onActivated');
         BackButton.superclass.init.call(this);
         var self = this;
         this._link = this.getChildControlByName('BackButton-caption');
         // Две подписки сделаны для того что бы в тестах можно было стриггерить событие нажатия
         // Клик по Link не проходит и сделан для того что бы можно было кликнуть по стрелке
         this._container.bind('click', function(){
            self._notify('onActivated');
         });
         this._link.subscribe('onActivated', function(){
            self._notify('onActivated');
         });
      },

      /**
       * Устанавливает текст кнопки
       * @param caption Текси
       */
      setCaption: function(caption){
         this._link.setCaption(caption);
         this._options.caption = caption;
         this._container.toggleClass('controls-BackButton__empty', !caption);
      },
      /**
       * Устанавливает исконку кнопки
       * @param icon Текси
       */
      setIcon: function(icon){
         this._link.setIcon(icon);
         this._options.icon = icon;
      }
   });

   return BackButton;
});