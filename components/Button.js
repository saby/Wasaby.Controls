define('SBIS3.CONTROLS/Button',
   [
      'SBIS3.CONTROLS/WSControls/Buttons/Button',
      'SBIS3.CONTROLS/Utils/ButtonUtil',
      'css!SBIS3.CONTROLS/Button/Button'
   ],

   function(Base, ButtonUtil) {

      'use strict';

      // почему нельзя сделать единый шаблон на <button - не работает клик по ссылке в ФФ
      // почему нельзя сделать единый шаблона на <a - нельзя положить <a внутрь <a, в верстке получится два рядом лежащих тега <a

      /**
    * Класс контрола "Обычная кнопка".
    *
    * <a href='/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-line/#button'>Демонстрационные примеры</a>.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @class SBIS3.CONTROLS/Button
    * @extends WSControls/Buttons/Button
    *
    *
    * @author Герасимов А.М.
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
    * @css controls-Button__icon Класс для изменения отображения иконки кнопки.
    * @css controls-Button__text Класс для изменения отображения текста на кнопке.
    *
    * @mixes SBIS3.CONTROLS/Button/ButtonDocs
    *
    * @control
    * @category Button
    * @public
    * @initial
    * <SBIS3.CONTROLS.Button caption="Кнопка" />
    */
      var Button = Base.extend([], /** @lends SBIS3.CONTROLS/Button.prototype */ {
         $protected: {
            _options: {

               /**
                * @cfg {String} Устанавливает размер кнопки.
                * @remark
                * Значение "m" установит средний размер кнопки.
                * Значение "l" устaновит большой размер кнопки.
                * @example
                * Пример 1. Большая кнопка:
                * фрагмент верстки:
                * <pre class="brush:xml">
                *     <option name="size">l</option>
                * </pre>
                */
               size: 'default',

               /**
                * @cfg {String} Устанавливает стилевое оформление кнопки.
                * @remark
                * По умолчанию значение опции "standard".
                * Значение "standard" установит стандартный стиль кнопки.
                * Значение "primary" устaновит акцентный стиль кнопки.
                * @example
                * Пример 1. Акцентное стилевое оформление кнопки:
                * фрагмент верстки:
                * <pre class="brush:xml">
                *     <option name="style">primary</option>
                * </pre>
                */
               style: 'standard',
               _svgIcon: null,
               emulateClickByTap: true
            }
         },
         _modifyOptions: function(options, parsedOptions, attrToMerge) {
            var opts = Button.superclass._modifyOptions.apply(this, arguments);
            opts._type = 'Button';
            opts.cssClassName += ' controls-Button';
            opts._iconDisabledClass = 'icon-button-disabled';

            ButtonUtil.getStyleByConfig(opts, attrToMerge);
            ButtonUtil.preparedClassFromOptions(opts);
            return opts;
         },
         show: function() {
         // если кнопка скрыта при построение, то она не зарегистрируется дефолтной,
         // поэтому при показе такой кнопки регистрируем её как дефолтную
            var oldVisible = this.isVisible();

            Button.superclass.show.call(this);
            if (!oldVisible && this.isPrimary()) {
               this.setDefaultButton(true);
            }
         },
         _toggleState: function() {
            var  container = this._container;

            container[0].className = container[0].className.replace(/(^|\s)controls-Button_size-\S+/g, '').replace(/(^|\s)controls-Button_state-\S+/g, '');
            container.addClass(ButtonUtil.getClassState(this._options));
            Button.superclass._toggleState.apply(this, arguments);
         }
      });

      return Button;

   });
