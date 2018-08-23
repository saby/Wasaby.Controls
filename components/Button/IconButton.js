/**
 * Модуль 'Кнопка-иконка'.
 *
 * @description
 */
define('SBIS3.CONTROLS/Button/IconButton', [
   'SBIS3.CONTROLS/WSControls/Buttons/Button',
   'SBIS3.CONTROLS/Utils/IconButtonUtil',
   'css!SBIS3.CONTROLS/Button/IconButton/IconButton'
],
function(WSButton, IconButtonUtil) {

   'use strict';

   /**
    * Класс контрола "Кнопка в виде значка".
    *
    * <a href="/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-icon/">Демонстрационные примеры</a>.
    * <a href="http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html">Спецификация</a>.
    *
    * @class SBIS3.CONTROLS/Button/IconButton
    * @extends WSControls/Buttons/Button
    * @mixes SBIS3.CONTROLS/Button/IconButton/IconButtonDocs
    * @demo Examples/IconButton/MyIconButton/MyIconButton
    * @author Михайловский Д.С.
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
    * @category Buttons
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS/Button/IconButton'>
    *    <option name="icon" value="icon-16 icon-AddButton icon-primary"></option>
    * </component>
    */

   var IconButton = WSButton.extend([], /** @lends SBIS3.CONTROLS/Button/IconButton.prototype */ {
      $protected: {
         _options: {

            /**
                * @cfg {String} Устанавливает размер кнопки.
                * @remark
                * Сейчас опция size будет работать только в сочетании style в значении 'bordered'
                * Значение "s" установит средний размер кнопки.
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
                * Значение "bordered" устaновит обводку кнопки.
                * @example
                * Пример 1. Кнопка иконка с обводкой:
                * фрагмент верстки:
                * <pre class="brush:xml">
                *     <option name="style">bordered</option>
                * </pre>
                */
            style: ''
         }
      },

      _modifyOptions: function(opts, parsedOptions, attrToMerge) {
         var
            options = IconButton.superclass._modifyOptions.apply(this, arguments);

         options._type = 'IconButton';
         options.className += ' controls-IconButton';
         options._textClass = ' controls-IconButton__text';
         opts._iconDisabledClass = 'icon-IconButton-disabled';

         IconButtonUtil.setStyleByConfig(options, attrToMerge);
         options.cssClassName += IconButtonUtil.getClassState(options);

         return options;
      },

      $constructor: function() {
         /*TODO оставляем добавку класса через jquery
          * чтобы избавиться - надо убрать зависимость от icons.css
          * в котором прописаны поведение и цвета для иконок по ховеру*/
         var className = this._container.get(0).className;
         if (className && className.indexOf('controls-IconButton__round-border') >= 0) {
            this._container.removeClass('action-hover');
         }
      },

      setIcon: function(icon) {
         if (icon) {
            if (((icon.indexOf('icon-error') >= 0) || (icon.indexOf('icon-done') >= 0))) {
               if (icon.indexOf('icon-error') >= 0) {
                  this.getContainer().removeClass('controls-IconButton__doneBorder').addClass('controls-IconButton__errorBorder');
               } else {
                  this.getContainer().addClass('controls-IconButton__doneBorder').removeClass('controls-IconButton__errorBorder');
               }
            } else {
               this.getContainer().removeClass('controls-IconButton__doneBorder').removeClass('controls-IconButton__errorBorder');
            }
         } else {
            this.getContainer().removeClass('controls-IconButton__doneBorder').removeClass('controls-IconButton__errorBorder');
         }
         IconButton.superclass.setIcon.call(this, icon);
      },
      _toggleState: function() {
         var  container = this._container;

         // селекторы с filter стирать не надо т.к. есть FilterPanel которая использует точно такие же селекторы controls-IconButton__filter
         // на них завязаны прикладники поэтому просто поменять имя селектора не получится
         container[0].className = container[0].className.replace(/(^|\s)controls-IconButton_(?!(_filter))\S+/g, '').replace(/(^|\s)controls-IconButton__(?!(filter))\S+/g, '');
         container.addClass(IconButtonUtil.getClassState(this._options));
         IconButton.superclass._toggleState.apply(this, arguments);
      }
   });

   return IconButton;

});
