/*$ws.core.ready.addCallback(function() 
{
   $ws.single.EventBus.channel( 'errors' ).subscribe('onRPCError', function( event, error )
   {
      RaiseValidation( error );
   });
});*/

RaiseValidation = function( error, args )
{
   if (error.classid.toUpperCase() === "{9E9917F6-AAF3-4AD5-939D-9293A9D660EC}") 
   {
      error.processed = true;
      var objects = error.addinfo,
          message = objects.Message || "",
          selectMessage = objects.SelectMessage || "",
          emailValidationMessage = objects.EmailValidationMessage || "",
          smsValidationMessage = objects.SmsValidationMessage || "",
          email = objects.Email || "",
          phone = objects.Phone || "",
          resource_id = objects.ResourceID || "",
          methodToSelectWay = objects.MethodToSend || "",
          methodToValidate = objects.MethodToValidate || "",
          storeOption = objects.StoreOption || "";
      if( (email === "" && phone == "") || methodToSelectWay === "" || methodToValidate === "" )
      {
         $ws.core.alert( "Вам запрещено выполнять данное действие!" );
         return;
      }
      var ctx = {};
      ctx["Message"] = message;
      ctx["SelectMessage"] = selectMessage;
      ctx["EmailValidationMessage"] = emailValidationMessage;
      ctx["SmsValidationMessage"] = smsValidationMessage;
      ctx["MethodToValidate"] = methodToValidate;
      ctx["ResourceID"] = resource_id;
      ctx["Phone"] = phone;
      ctx["Email"] = email;
      ctx["MethodToSelectWay"] = methodToSelectWay;
      ctx["StoreOption"] = storeOption;
      ctx["Args"] = args;
      $ws.core.attachInstance("Control/Area:Dialog", 
      {
         'template' : 'Validation',
         'context' : ctx
      });
   }
};