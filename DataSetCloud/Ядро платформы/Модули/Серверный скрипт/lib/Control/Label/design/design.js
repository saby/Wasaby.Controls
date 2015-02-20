/**
 * Created by du.kulaevskiy on 30.09.13.
 */
define(['js!SBIS3.CORE.Infobox', 'js!genie.ActiveDocument', 'css!SBIS3.CORE.Label/design/design'], function(Infobox, ActiveDocument){
   "use strict";

   var Design = {
      'options' : [
         {
            action : 'customs',
            customizationDialog : 'bindUnbind',
            iconParams : 'returnIconParams'
         },
         {
            action : 'customs',
            customizationDialog : 'showCustomizationDialog',
            iconParams : 'returnConfigIcon'
         }
      ],

      _showControlPopup : function(control, container){
         // todo сделать универсальнее
         var instance, def;

         def = new $ws.proto.Deferred();
         // Запрашиваем модуль для отображения
         $ws.require(control).addCallback(function(module){
            var
               jq = $(container),
               destination = jq.parent();

            // Получили конструктор, рендерим контейнер
            // TODO получаем куда помещать всплывашку таким вот нехорошим способом. Нужно, например, если создается для иконки в оверлее
            var popup = $('<div class="ws_float_control_panel"></div>').appendTo(destination);
            // Создаем экземпляр, отдаем ему наш контейнер
            instance = new module[0]({ element: popup });

            // Расчет положения
            var
               rect = jq.position(),
               pop_rect = popup[0].getBoundingClientRect(),
               ph = destination.height(),
               pw = destination.width(),
               x = rect.left + jq.width()/2 - pop_rect.width/2,
               y = rect.top - pop_rect.height;
            if( x + pop_rect.width > pw ){
               x = pw - pop_rect.width;
            }
            if( x < 0 ){
               x = 0;
            }
            if( y + pop_rect.height > ph ){
               x = ph - pop_rect.height;
            }
            if( y < 0 ){
               y = 0;
            }

            var css = {
               'left' : x + 'px',
               'top' : y + 'px',
               'z-index' : 303
            };
            popup.css(css);

            popup.animate({opacity: 1}, "slow");

            // Событие для исчезновения меню
            $(document).bind('mousedown.' + instance.getId(), function( e ){
               if ( !( popup.has(e.target).length !== 0 ) ) {
                  popup.animate({opacity: 0}, "slow", function(){
                     popup.remove();
                     $(document).unbind('mousedown.' + instance.getId());
                  });
               }
            });

            def.callback(instance);
            return instance;
         });

         return def;
      },

      returnConfigIcon : function(control){
         // TODO чтобы не было иконки настроек у отвязаной метки, мы возвращаем класс без background
         var
            doc = ActiveDocument.get(),
            childControls = doc.getChildComponents(control.GDI),
            result = {'class': 'customizationIconLabelNoIcon', title: ''};

         if (doc.getSelectedComponents().length === 1 && childControls.length !== 0 ) {
            result = null;
         }

         return result;
      },

      returnIconParams : function(control){
         var
            doc = ActiveDocument.get(),
            childControls = doc.getChildComponents(control.GDI),
            result = null;
         if (doc.getSelectedComponents().length === 1) {
            if( childControls.length !== 0 ) {
               result = {'class': "customizationIconLabelDisconnect", title: "Отвязать"};
            }
            else {
               result = {'class': "customizationIconLabelQuestion", title: "&nbsp;"};
            }
         }
         else {
            if(doc.getSelectedComponents().length === 2) {
               result = {'class': "customizationIconLabelConnect", title: "Привязать"};
            }
         }

         return result;
      },

      showCustomizationDialog : function(control) {
         var doc = ActiveDocument.get();

         Design._showControlPopup("js!genie.LabelCustomization", $('.customizationIcon'))
            .addCallback(function(ctrl){
               var
                  options = control._options,
                  pos = options['position'];
               ctrl.setValue(pos + "." + (( pos == 'top' ) ? options['textAlign'] : options['verticalAlign']));
               ctrl.subscribe('onChange', function(e, val){
                  var args = val.value.split(".");
                  if(args[0] == 'top'){
                     doc.setComponentProperty(control.GDI, 'ws-config.position', args[0]);
                     doc.setComponentProperty(control.GDI, 'ws-config.textAlign', args[1]);
                  }
                  else {
                     doc.setComponentProperty(control.GDI, 'ws-config.position', args[0]);
                     doc.setComponentProperty(control.GDI, 'ws-config.verticalAlign', args[1]);
                  }

               });
               return ctrl;
            });
      },

      bindUnbind : function(control) {
         var
            doc = ActiveDocument.get(),
            childControls = doc.getChildComponents(control.GDI),
            array = [];

         var getChildIndex = function getChildIndex( parent, child ) {
            var array = doc.getChildComponents(parent.GDI);
            for( var i = 0; i < array.length; ++i ) {
               if( array[i] === child ) {
                  return i;
               }
            }

            return 0;
         };

         if( doc.getSelectedComponents().length == 1 ) {
            // Если внутри нет элементов, то уходим
            if( childControls.length === 0 )
               return;
            // Если выделен один компонент, то отвязываем компоненты от метки
            var
               parent = doc.getComponentParent(control.GDI),
               index = getChildIndex(parent, control);

            for( var i = 0; i < childControls.length; ++i ) {
               var ctrlMeta = childControls[i];
               array.push({component: ctrlMeta, destination: parent, index: index+1});
            }

            doc.moveComponents(array);
            doc.setComponentProperty(control.GDI, 'ws-config.position', 'none');
         }
         else {
            if( doc.getSelectedComponents().length == 2 ) {
               // Если выделено два, то привязываем компонент к метке
               var ctrl = doc.getSelectedComponents()[1];
               array = [{component: doc.getComponent(ctrl), destination: control, areaNameDest:'labelContent'}];
               doc.moveComponents(array);
               doc.setComponentProperty(control.GDI, 'ws-config.position', 'left');
            }
         }
      }
   }

   // TODO Используется функция live для показа иконки, тк элемент создается в DesignTime
   $(".customizationIconLabelQuestion").live('mouseenter', function(){
      Infobox.show($('.customizationIconLabelQuestion'), "Для привязки метки к другому контролу выделите их и нажмите на иконку", '100px', 500, 10000, true);
   });
   $(".customizationIconLabelQuestion").live('mouseleave', function(){
      Infobox.hide();
   });

   return Design;
});