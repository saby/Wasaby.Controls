/**
 * Created by ps.borisov on 29.08.2016.
 */

define('js!SBIS3.CONTROLS.ColorStyle', [
   'js!SBIS3.CONTROLS.RadioGroup',
   'html!SBIS3.CONTROLS.ColorStyle/resources/ItemTemplate',
   'Core/EventBus',
   'js!SBIS3.CONTROLS.ColorRadioButtonNew'
], function(RadioGroup, ItemTemplate, EventBus) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора цвета
    * @class SBIS3.CONTROLS.ColorGroup
    * @extends SBIS3.CONTROLS.RadioGroup
    * @public
    * @author Борисов П.С.
    */

   var ColorGroup = RadioGroup.extend(/** @lends SBIS3.CONTROLS.ColorGroup.prototype */ {
      $protected: {
         _options: {
            items: [
               {color:'#000000'},
               {color:'#EF463A'},
               {color:'#72BE44'},
               {color:'#0055BB'},
               {color:'#A426D9'},
               {color:'#999999'}
            ],
            allowEmptySelection: false,
            _defaultItemTemplate: ItemTemplate
         }
      },
      $constructor: function() {
         this._container.on('mousedown focus', this._blockFocusEvents);
      },
      //TODO: убрать метод после закртытия задачи: https://inside.tensor.ru/opendoc.html?guid=b67f7f5b-8b91-4fcb-8f83-74fd29d64db4
      _blockFocusEvents: function(event) {
         var eventsChannel = EventBus.channel('WindowChangeChannel');
         event.preventDefault();
         event.stopPropagation();
         //Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса
         if(event.type === 'mousedown') {
            eventsChannel.notify('onDocumentClick', event);
         }
      }
   });
   return ColorGroup;
});