/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define(
   'js!SBIS3.CONTROLS.TabButton',
   [
      'js!SBIS3.CONTROLS.RadioButtonBase',
      'tmpl!SBIS3.CONTROLS.TabButton',
      'js!SBIS3.CONTROLS.IconMixin',
      'Core/Sanitize',
      'css!SBIS3.CONTROLS.TabButton'
   ], function (RadioButtonBase, dotTplFn, IconMixin, Sanitize) {

   'use strict';
   /**
    * Контрол, отображающий корешок закладки. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.TabButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @author Крайнов Дмитрий Олегович
    *
    * @mixes SBIS3.CONTROLS.IconMixin
    */

   var prepareOrder = function(order) {
      return '-webkit-box-ordinal-group:' +  order +
      ';-moz-box-ordinal-group:' + order +
      ';-ms-flex-order:' +  order +
      ';-webkit-order:' + order +
      ';order:' + order;
   };

   var TabButton = RadioButtonBase.extend([IconMixin],/** @lends SBIS3.CONTROLS.TabButton.prototype */ {
      $protected: {
         _options: {
            _order: undefined,
            _prepareOrder: prepareOrder,
            /**
             * @cfg {String} С какой стороны контейнера отображать вкладку
             * @variant right с правой стороы
             * @variant left с левой стороны
             * @example
             * <pre>
             *     <option name="align">left</option>
             * </pre>
             */
            align: 'right'
         }
      },
      _dotTplFn: dotTplFn,

      _modifyOptions: function() {
         //TODO костыль какой-то
         var opts = TabButton.superclass._modifyOptions.apply(this, arguments);
         opts.sanitize = function(markup) {
            return Sanitize (markup.caption, {validNodes: {component: true, input: true, form: true, textarea: true}, validAttributes : {config: true} })
         };
         opts._order = opts._prepareOrder(opts._order);
         return opts;
      },

      $constructor: function () {
      },
      
      init: function () {
         TabButton.superclass.init.call(this);

         // если у tabbutton нет потомков, он не должен участовать в обходе по табу и принимать активность на activateFirstControl
         // если внутри есть потомки, об обходе их по табу должен беспокоиться их создатель
         if (!this.getImmediateChildControls().length) {
            this.setTabindex(0);
         }
      },

      _checkEnabledByClick: function(){
         return true;
      },

      _drawIcon: function() {
         var newIcon = $('<span></span>').addClass(this._options._iconClass);
         this.getContainer().find('.controls-TabButton__icon').html(newIcon);
      },

      setCaption: function(caption){
         TabButton.superclass.setCaption.apply(this, arguments);
         var $caption = $('.controls-TabButton__caption', this.getContainer());
         $caption.html(caption);
         this.reviveComponents();
      }
   });

   return TabButton;

});