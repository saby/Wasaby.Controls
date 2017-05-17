define('js!SBIS3.CONTROLS.Button',
   [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!SBIS3.CONTROLS.Button/Button.compatible',
      'js!WS.Data/Entity/InstantiableMixin',
      'tmpl!SBIS3.CONTROLS.Button',
      'Core/core-functions',
      'css!SBIS3.CONTROLS.Button'
   ],

   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             ButtonCompatible,
             InstantiableMixin,
             template,
             functions) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * Можно настроить:
    * <ol>
    *    <li>{@link SBIS3.CORE.Control#allowChangeEnable возможность изменения доступности кнопки};</li>
    *    <li>{@link WSControls/Buttons/ButtonBase#caption текст на кнопке};</li>
    *    <li>{@link SBIS3.CORE.Control#enabled возможность взаимодействия с кнопкой};</li>
    *    <li>{@link SBIS3.CONTROLS.IconMixin#icon иконку на кнопке};</li>
    *    <li>{@link primary по умолчанию ли кнопка};</li>
    *    <li>{@link SBIS3.CORE.Control#visible видимость кнопки};</li>
    * </ol>
    * @class SBIS3.CONTROLS.Button
    * @extends WSControls/Buttons/ButtonBase
    * @demo SBIS3.CONTROLS.Demo.MyButton
    *
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
    * @cssModifier controls-Button__filled непрозрачный фон кнопки
    * @cssModifier controls-Button__big Большая кнопка.
    * @cssModifier controls-Button__ellipsis Кнопка, на которой в тексте появляется многоточие при нехватке ширины.
    * @cssModifier controls-Button__withoutCaption Кнопка, без заголовка
    * !Важно: при добавлении этого класса сломается "Базовая линия".
    *
    * @css controls-Button__icon Класс для изменения отображения иконки кнопки.
    * @css controls-Button__text Класс для изменения отображения текста на кнопке.
    *
    * @control
    * @category Buttons
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.Button'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    */
      var Button = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, ButtonCompatible, InstantiableMixin],
         {
            _controlName: 'SBIS3.CONTROLS.Button',
            _template: template,

            _useNativeAsMain: true,

            constructor: function(cfg) {
               this.deprecatedContr(cfg);
               this._publish('onActivated');
            },

            _onClick: function(){
               this._notify("onActivated");
            },

            _onMouseDown: function(){
               if (this._options.class.indexOf("controls-Click__active")===-1) {
                  this._options.class += " controls-Click__active ";
                  this._setDirty();
               }
            },

            _onMouseUp: function(){
               this._options.class.replace("controls-Click__active","");
               this._setDirty();
            }

         });

      return Button;
   });