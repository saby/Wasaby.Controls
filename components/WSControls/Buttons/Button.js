
define('SBIS3.CONTROLS/WSControls/Buttons/Button', [
   'Core/constants',
   'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
   'tmpl!SBIS3.CONTROLS/WSControls/Buttons/Button',
   'tmpl!SBIS3.CONTROLS/WSControls/Buttons/resources/contentTemplate',
   'tmpl!SBIS3.CONTROLS/WSControls/Buttons/resources/AddIcon',
   'Core/core-instance'
], function(constants, ButtonBase, dotTplFn, contentTemplate, svgIconTpl, cInstance) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * Можно настроить:
    * <ol>
    *    <li>{@link Lib/Control/Control#allowChangeEnable возможность изменения доступности кнопки};</li>
    *    <li>{@link WSControls/Buttons/ButtonBase#caption текст на кнопке};</li>
    *    <li>{@link Lib/Control/Control#enabled возможность взаимодействия с кнопкой};</li>
    *    <li>{@link SBIS3.CONTROLS/Mixins/IconMixin#icon иконку на кнопке};</li>
    *    <li>{@link primary по умолчанию ли кнопка};</li>
    *    <li>{@link Lib/Control/Control#visible видимость кнопки};</li>
    * </ol>
    * @class WSControls/Buttons/Button
    * @extends WSControls/Buttons/ButtonBase
	* @demo Examples/Button/MyButton/MyButton
    *
    * @author Крайнов Д.О.
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
    * !Важно: при добавлении этого класса сломается 'Базовая линия'.
    *
    * @css controls-Button__icon Класс для изменения отображения иконки кнопки.
    * @css controls-Button__text Класс для изменения отображения текста на кнопке.
    *
    * @control
    * @category Button
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS/WSControls/Buttons/Button'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    */

   var Button = ButtonBase.extend(/** @lends WSControls/Buttons/Button.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _keysWeHandle: [
            constants.key.enter
         ],
         _options: {

            /**
             * @cfg {Boolean} Пользовательский шаблон внутреннего контента кнопки.
             */
            contentTemplate: contentTemplate,

            /**
             * @cfg {Boolean} Кнопка по умолчанию
             * Кнопка будет срабатывать при нажатии клавиши Enter, и будет визуально отличаться от других кнопок.
             * На странице может быть только одна кнопка по умолчанию.
             * Возможные значения:
             * <ul>
             *    <li>true - кнопка является кнопкой по умолчанию;</li>
             *    <li>false - обычная кнопка.</li>
             * </ul>
             * @example
             * <pre class='brush:xml'>
             *     <option name='primary'>true</option>
             * </pre>
             * @see isPrimary
             * @see setPrimary
             */
            primary: false,
            _iconDisabledClass: 'icon-disabled',
            style: null,
            _type: '',
            _iconState: null,
            _iconSize: null,
            _svgIconTpl: svgIconTpl,
            _fix1175160840: false
         },
         _contentContainer: null,
         _iconClass: null
      },


      _parseIconClass: function(opts) {
         var iconStates = ['icon-primary', 'icon-hover', 'icon-error', 'icon-done', 'icon-disabled', 'icon-attention'],
            state = '',
            i = -1,
            statePos = -1,
            icon = opts.icon,
            sizes = ['16', '24', '32', 'small', 'medium', 'large'];

         if (icon) {
            sizes.forEach(function(size) {
               if (icon.indexOf('icon-' + size) !== -1) {
                  opts._iconSize = size;
               }
            });

            this._iconClass = icon.indexOf('sprite:') === 0 ? icon.substr(7) : icon;

            while (statePos === -1 && i < iconStates.length) {
               i++;
               state = iconStates[i];
               statePos = this._iconClass.indexOf(state);
            }
            opts._iconState = statePos !== -1 ? state : null;

            if (statePos !== -1) {
               opts._iconClass = this._iconClass.substring(0, statePos) + this._iconClass.substring(statePos + state.length);
            }
         }
      },

      _modifyOptions: function() {
         var opts = Button.superclass._modifyOptions.apply(this, arguments);

         this._parseIconClass(opts);
         opts.cssClassName += (' controls-ButtonBase_state-' + (opts.enabled ? 'enabled' : 'disabled'));
         return opts;
      },

      $constructor: function() {
         this._contentContainer = this._container.find('.controls-ButtonBase__content');
      },
      init: function() {
         Button.superclass.init.call(this);
         this._checkIfPrimaryAfterShow();
      },

      // После того, как кнока станет видима, нужно проверить, является ли она кнопкой по умолчанию, и при
      // необходимости зарегистрировать ее
      _checkIfPrimaryAfterShow: function() {
         var
            self = this,
            containingArea = self.getTopParent();

         function tryRegisterDefault() {
            if (self._options.primary && !self._defaultAction) {
               self._registerDefaultButton();
            }
         }

         if (containingArea && cInstance.instanceOfModule(containingArea, 'Lib/Control/FloatArea/FloatArea')) {
            // У FloatArea есть событие onAfterVisibilityChange, которое она выстреливает гарантированно после того
            // как закончит строиться и показываться. В этом случае нам не нужно делать задержек, можно сразу
            // регистрировать кнопку
            containingArea.subscribe('onAfterVisibilityChange', function(event, isVisible) {
               if (isVisible) {
                  tryRegisterDefault();
               }
            });
         } else {
            self.subscribe('onAfterShow', function() {
               // Нужно подождать, пока предки станут видимы. onAfterShow выстреливают "отложенным событием", то есть
               // этот обработчик вызывается только тогда, когда завершены все "пакеты" (batches) в ControlBatchUpdater.
               // Однако в 2016 году в AreaAbstract#destroy (сейчас в AreaAbstract.compatible#destroy) был добавлен код,
               // удаляющий все незавершенные пакеты из ControlBatchUpdater'a. Это было сделано, так как в случае
               // уничтожения не до конца созданного компонента (например переключение с не до конца загрузившейся
               // вкладки в панели), в ControlBatchUpdater'e навсегда зависали незавершенные пакеты, что приводило
               // к несрабатыванию отложенных обработчиков до перезагрузки страницы.
               // Из-за этого, если во время появления primary-кнопки в обасти произойдет уничтожение какого-то
               // из компонентов (например вызовут rebuildMarkup у другого компонента в той же панели), onAfterShow
               // сработает слишком рано, еще до отображения родителя. Поэтому мы ждем какое-то время, чтобы уже
               // построенные родители могли отобразиться.
               setTimeout(function() {
                  tryRegisterDefault();
               }, 600);
            });
         }
      },

      setCaption: function(caption) {
         Button.superclass.setCaption.call(this, caption);
         this._redrawButton();
      },

      /**
        * Метод установки кнопки по умолчанию.
        * @param flag Признак является ли кнопкой по умолчанию.
        * Возможные значения:
        * <ul>
        *    <li>true - кнопка по умолчанию;</li>
        *    <li>false - обычная кнопка.</li>
        * </ul>
        * @example
        * <pre>
        *    var btn = this.getChildControlByName('myButton')
        *    btn.setPrimary(false);
        * </pre>
        * @see isPrimary
        * @see primary
        */
      setPrimary: function(flag) {
         this._options.primary = !!flag;
         this._toggleState();
      },

      /**
       * Является ли кнопкой по умолчанию.
       * @returns {Boolean} Возвращает признак является ли кнопкой по умолчанию.
       * Возможные значения:
       * <ul>
       *    <li>true - кнопка по умолчанию;</li>
       *    <li>false - обычная кнопка.</li>
       * </ul>
       * @example
       * <pre>
       *     if (!button.isPrimary()) {
       *        button.setPrimary(true);
       *     }
       * </pre>
       * @see primary
       * @see setPrimary
       */
      isPrimary: function() {
         return this._options.primary;
      },

      /**
        * Метод установки/замены иконки на кнопке.
        * @param icon Иконка из набора <a href="/docs/js/icons/">общих иконок</a>. Задаётся через sprite.
        * @example
        * <pre>
        *    var btn = this.getChildControlByName('myButton');
        *    btn.setIcon('sprite:icon16 icon-Alert icon-done');
        * </pre>
        */
      _drawIcon: function() {
         this._parseIconClass(this._options);
         this._redrawButton();
      },

      _redrawButton: function() {
         // rebuildMarkup не подходит, т.к. пикер меню смотрит на видимость элемента,
         // а при перерисовке кнопка скрывается, что приводит к закрытию пикера
         if (this._contentContainer) {
            this._contentContainer[0].innerHTML = contentTemplate(this._options);
         }
      },

      /**
       * Установить стилевое оформление кнопки
       * @param style стилевое оформление.
       * @see style
       */
      setStyle: function(style) {
         this._options.style = style;
         this._toggleState();
      },

      setEnabled: function(enabled) {
         Button.superclass.setEnabled.call(this, enabled);
         this._container.attr('disabled', !this.isEnabled());
      },

      _setEnabled: function(enabled) {
         Button.superclass._setEnabled.apply(this, arguments);
         this._toggleState();
      },

      // метод который будет переключать состояния кнопки, пока не перейдем на vDom
      // https://online.sbis.ru/opendoc.html?guid=aa39901a-7aec-4ebe-ab51-a123c53eac92
      _toggleState: function() {
         var  container = this._container,
            iconContainer = container.find('.controls-Button__icon');

         container[0].className = container[0].className.replace(/(^|\s)controls-ButtonBase_state-\S+/g, '');
         container.addClass('controls-ButtonBase_state-' + (this.isEnabled() ? 'enabled' : 'disabled'));

         if (iconContainer.length) {
            iconContainer[0].className = iconContainer[0].className.replace(/(^|\s)icon-\S+/g, '');
            iconContainer.addClass(this._options._iconClass + (this.isEnabled() ? (' ' + this._options._iconState || '') : (' ' + this._options._iconDisabledClass)));
         }
      },

      _notifyOnActivated: function(originalEvent) {
         Button.superclass._notifyOnActivated.apply(this, arguments);

         //preventDefault тоже надо делать, поскольку иначе при нажатии enter на кнопки генерируется click, и onActivated стреляет два раза
         // похоже, что это нативное поведение html у кнопки виновато
         if (originalEvent.which === constants.key.enter) {
            originalEvent.preventDefault();
         }
      },

      /*TODO методы для поддержки defaultButton*/
      /**
        * @noShow
        * @returns {boolean}
        */
      isDefaultButton: function() {
         return !!this._options.primary;
      },
      _unregisterDefaultButton: function() {
         this.sendCommand('unregisterDefaultButtonAction');
      },

      _registerDefaultButton: function() {
         // регистрироваться имеют права только видимые кнопки. если невидимая кнопка зарегистрируется, мы нажмем enter и произойдет неведомое действие
         if (this.isVisibleWithParents()) {
            // сначала отменяем регистрацию текущего действия по умолчанию, а потом регистрируем новое действие
            this._unregisterDefaultButton();

            // action создаем только после отмены регистрации, иначе он зануляется
            this._defaultAction = function(e) {
               if (this && this.isEnabled()) {
                  this._onClickHandler(e);
                  return false;
               } else {
                  return true;
               }
            };
            this._defaultAction = this._defaultAction.bind(this);
            this.sendCommand('registerDefaultButtonAction', this._defaultAction, this);
         }
      },

      /**
        * Делает кнопку дефолтной или отменяет таковое состояние
        *
        * @noShow
        * @param {Boolean} [isDefault] Если не указан, считается true
        * @param {Boolean} [dontSendCommand] Не стрелять событием о регистрации/разрегистрации кнопки
        */
      setDefaultButton: function(isDefault, dontSendCommand) {
         if (isDefault === undefined) {
            isDefault = true;
         }

         if (!dontSendCommand) {
            if (isDefault) {
               this._registerDefaultButton();
            } else {
               this._unregisterDefaultButton();
            }
         }

         this.setPrimary(isDefault);
      },

      destroy: function() {
         this._contentContainer = null;
         if (this.isPrimary()) {
            this._unregisterDefaultButton();
         }
         Button.superclass.destroy.apply(this, arguments);
      }

      /*TODO конец*/
   });

   return Button;

});
