import Control = require('Core/Control');
import template = require('wml!Controls/_dragnDrop/Container/Compound/Compound');
import draggingTemplateWrapper = require('wml!Controls/_dragnDrop/DraggingTemplateWrapper');
import Vdom = require('Vdom/Vdom');
      var ZINDEX_FOR_OLD_PAGE = 10000;

      export = Control.extend({
         _template: template,
         _draggingTemplate: null,

         _onRegisterHandler: function(event, eventName, emitter, handler) {
            if (['mousemove', 'touchmove', 'mouseup', 'touchend'].indexOf(eventName) !== -1) {
               if (handler) {
                  this._compoundHandlers = this._compoundHandlers || {};
                  this._compoundHandlers[eventName] = function(event) {
                     handler.apply(emitter, [new Vdom.SyntheticEvent(event)]);
                  };
                  document.body.addEventListener(eventName, this._compoundHandlers[eventName]);
               } else if (this._compoundHandlers && this._compoundHandlers[eventName]) {
                  document.body.removeEventListener(eventName, this._compoundHandlers[eventName]);
                  this._compoundHandlers[eventName] = null;
               }
            }
         },

         _removeDraggingTemplate: function() {
            if (this._draggingTemplate) {
               this._draggingTemplate.remove();
               this._draggingTemplate = null;
            }
         },

         _documentDragEnd: function() {
            this._removeDraggingTemplate();
         },

         _updateDraggingTemplate: function(event, draggingTemplateOptions, draggingTemplate) {
            this._removeDraggingTemplate();

            //На старых страницах нет application, который отвечает за создание и позиционирование draggingTemplate.
            //Поэтому сами создади его и добавим в body.
            if (draggingTemplate) {
               this._draggingTemplate = $(draggingTemplateWrapper({
                  draggingTemplateOptions: draggingTemplateOptions,
                  draggingTemplate: draggingTemplate
               }));
               this._draggingTemplate.appendTo(document.body);

               //На старых страницах стартовый z-index всплывающих окон 1050. Сделаем наш z-index заведомо больше.
               this._draggingTemplate.css('z-index', ZINDEX_FOR_OLD_PAGE);
            }
         }
      });
   
