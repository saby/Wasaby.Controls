$ws.core.ready.addCallback(function() {
   var isCaptureDialogOpened = false; // признак, что диалог с капчей уже открыт


   $ws.single.EventBus.channel( 'errors' ).subscribe('onRPCError', function( event, error )
   {
      if (error.classid.toLowerCase() === "{d2cff47d-7819-45c6-9da4-74acdde4c90b}") 
      {
         if (isCaptureDialogOpened === false)
         {
            // поднять окошко с капчей
            isCaptureDialogOpened = true;
            $ws.core.attachInstance('Control/Area:Dialog', {
               template: "/resources/Antibot/CaptureDialog",
               handlers: {
                  onBeforeClose: function() { isCaptureDialogOpened = false; }
               }
            });
         }

         // дальше эту ошибку пробрасывать(обрабатывать) не надо
         error.processed = true;
      }
   });

});

// $ws.single.EventBus.channel( 'errors' ).unsubscribe('onRPCError', _handler );
