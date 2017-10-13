define('js!SBIS3.CONTROLS.PhoneCall', ["Core/IoC", 'js!SBIS3.CONTROLS.PhoneTextBox'], function(IoC, PhoneTextBox) {
   'use strict';
   IoC.resolve('ILogger').error('PhoneCall', 'Класс SBIS3.CONTROLS.PhoneCall устарел, используйте SBIS3.CONTROLS.PhoneTextBox');
   return PhoneTextBox;

});