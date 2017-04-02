define('js!SBIS3.CONTROLS.SwitcherDouble', ['js!SBIS3.CORE.Control', 'html!SBIS3.CONTROLS.SwitcherDouble', 'js!SBIS3.CONTROLS.Clickable', 'js!SBIS3.CONTROLS.FormWidgetMixin', 'js!SBIS3.CONTROLS.Checkable', 'css!SBIS3.CONTROLS.SwitcherDouble'], function(Control, dotTplFn, Clickable, FormWidgetMixin, Checkable) {

   'use strict';
   /**
    * Контрол, отображающий двухпозиционный переключатель для поддержания макетов online.sbis.ru.
    * Переключатель отличается от обычного {@link SBIS3.CONTROLS.Switcher} только внешне. Функционально они одинаковые.
    * В качестве конфигурации можно изменять следующие настройки:
    * <ol>
    *    <li>{@link state} - устанавливает начальное состояние переключателя;</li>
    *    <li>{@link stateOn} - устанавливает текст подписи переключателя при включенном состоянии;</li>
    *    <li>{@link stateOff} - устанавливает текст подписи переключателя при выключенном состоянии.</li>
    * </ol>
    *
    * @class SBIS3.CONTROLS.SwitcherDouble
    * @extends SBIS3.CORE.Control
    *
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.Clickable
    * @mixes SBIS3.CONTROLS.Checkable
    *
    * @demo SBIS3.Demo.MySwitcherDouble
    *
    * @author Черемушкин Илья Вячеславович
    *
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner stateKey
    * @ignoreOptions subcontrol verticalAlignment parent
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe unsubscribeFrom
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady
    *
    * @control
    * @public
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.SwitcherDouble'>
    *    <option name="stateOff" value="Выкл"></option>
    *    <option name="stateOn" value="Вкл"></option>
    * </component>
    */
   var SwitcherDouble = Control.Control.extend( [Clickable, FormWidgetMixin, Checkable], /** @lends SBIS3.CONTROLS.SwitcherDouble.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _textContainer: {},
         _options: {
            /**
             * @cfg {String} Устанавливает начальное положение переключателя.
             * @see stateOn
             * @see stateOff
             */
            state: 'off',
            /**
             * @cfg {String} Устанавливает текст подписи переключателя при включенном состоянии.
             * @remark
             * В качестве значения можно передавать вёрстку.
             * @example
             * <b>Пример 1.</b>. Устанавливаем текст подписи переключателя обычной строкой.
             * <pre>
             *     <option name="stateOn" value="Скрыть"></option>
             * </pre>
             * <b>Пример 2.</b>. Устанавливаем вёрстку в качестве текста подписи переключателя.
             * <pre>
             *     <option name="stateOn" value="<span style='color: red'>Скрыть</span>"></option>
             * </pre>
             * @see state
             * @see setState
             * @see setStateOff
             * @see setStateOn
             * @translatable
             */
            stateOn: '',
            /**
             * @cfg {String} Устанавливает текст подписи переключателя при выключенном состоянии.
             * @remark
             * В качестве значения можно передавать вёрстку.
             * @example
             * <b>Пример 1.</b>. Устанавливаем текст подписи переключателя обычной строкой.
             * <pre>
             *     <option name="stateOff" value="Скрыть"></option>
             * </pre>
             * <b>Пример 2.</b>. Устанавливаем вёрстку в качестве текста подписи переключателя.
             * <pre>
             *     <option name="stateOff" value="<span style='color: red'>Скрыть</span>"></option>
             * </pre>
             * @see state
             * @see setState
             * @see setStateOff
             * @see setStateOn
             * @translatable
             */
            stateOff: '',
            /**
             * @cfg {String} Устанавливает расположение переключателя.
             * @variant horizontal Горизонтальное расположение.
             * @variant vertical Вертикальное расположение.
             */
            disposition: 'horizontal'
         }
      },

      _modifyOptions : function() {
         var opts = SwitcherDouble.superclass._modifyOptions.apply(this, arguments);
         /*пока кто-то затачивается на state будем поддерживать и checked и state вместе*/
         this._syncOptions(opts);
         return opts;
      },

      _syncOptions: function(opts) {
         /*Если checked true это значит его осознанно поставили + считаем checked главнее*/
         if (opts.checked) {
            opts.state = 'on';
         }
         /*а эта ситуация, если выставляют включенность через state*/
         else if (opts.state == 'on') {
            opts.checked = true;
         }
      },

      $constructor: function() {
         this._textContainer.off = $('.js-controls-SwitcherDouble__textOff',this._container.get(0));
         this._textContainer.on = $('.js-controls-SwitcherDouble__textOn',this._container.get(0));
         this._container.bind('mousedown' , function(e) { e.preventDefault(); });
         this._switcher = $('.js-controls-Switcher__toggle', this._container.get(0));
      },

      _notifyOnActivated : function() {
         this._notify('onActivated', this.getState());
      },

      _clickHandler : function(e) {
         if (e.target == this._textContainer.off.get(0)) {
            if (this.isEnabled()) {
               this.setChecked(false);
            }
         }
         else if (e.target == this._textContainer.on.get(0)) {
            if (this.isEnabled()) {
               this.setChecked(true);
            }
         }
         else {
            if (e.target == this._switcher.get(0) || this._switcher.find(e.target).length) {
               if (this.isEnabled()) {
                  if (this._options.checked == true) {
                     this.setChecked(false);
                  } else {
                     this.setChecked(true);
                  }
               }
            }
         }
      },

      setChecked: function(checked) {
         SwitcherDouble.superclass.setChecked.apply(this, arguments);
         var newState;
         if (checked) {
            this._options.state = 'on';
         }
         else {
            this._options.state = 'off';
         }
         var oppositeState = (this._options.state == 'on') ? 'off' : 'on';

         this._switcher.addClass('controls-SwitcherDouble-' + this._options.state + '-toggled').removeClass('controls-SwitcherDouble-' + oppositeState + '-toggled');
         this._textContainer[oppositeState].addClass('controls-SwitcherDouble__unselected');
         this._textContainer[this._options.state].removeClass('controls-SwitcherDouble__unselected');
      },


      setState: function(state) {
         if (state == 'on' || state == 'off'){
            this.setChecked(state == 'on');
            this._notifyOnPropertyChanged('state');
         }
      },

      getState: function() {
         return this._options.state;
      },

      setStateOff: function(text){
         this._options.stateOff = text;
         this._textContainer['off'].html(text);
      },

      setStateOn: function(text){
         this._options.stateOn = text;
         this._textContainer['on'].html(text);
      }
   });

   return SwitcherDouble;
});