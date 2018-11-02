/**
 * Created by ee.volkova1 on 14.06.2018.
 */
define('Controls/Decorator/PhoneNumber',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'wml!Controls/Decorator/PhoneNumber/PhoneNumber',
      'Controls/Decorator/PhoneNumber/Dictionary'
   ],
   function(Control, descriptor, template, phoneCodeModule) {

      'use strict';

      /**
       * Beautify Phone number from string which consists of digits and another symbols(spaces, brackets, hyphens) to formatted string
       * for Russian mobile numbers format is +7(***) ***-**-**
       * for another Russian numbers +7(****) **-**-** or +7(*****) *-**-** depends on city code
       * for foreign numbers +foreigncode restdigits
       *
       * @class Controls/Decorator/PhoneNumber
       * @extends Core/Control
       * @control
       * @public
       * @author Журавлев М.С.
       * @category Decorators
       */

      /**
       * @name Controls/Decorator/PhoneNumber#number
       * @cfg {String} Number for beautifying
       */

      var _private = {
         formatPhone: function(phoneIn) {
            phoneIn = (phoneIn || '').toString();

            /*remove non-numeric characters from the string*/
            var
               phoneStr = (phoneIn || '').replace(/\D/g, '');

            if (phoneStr.length > 10) {
               phoneStr = phoneStr.replace(/^(7|8|07|08)/g, '7'); // replace 7, 8, 07, 08 with the Russian code - 7
            } else if (phoneStr.length === 10) {
               phoneStr = '7' + phoneStr; // if the length of the string is 10, then this is Russia and the user forgot to write 8 or +7
            }

            var
               country_code = phoneStr.charAt(0),
               phone_max_length = country_code === '7' ? 11 : phoneStr.length,  //if the number begins with '7', the maximum length will be 11 symbols
               phone = phoneStr.substr(0, phone_max_length), // cut to normal number
               subphone = phoneStr.substr(phone_max_length), // extra symbols is additional number
               /**
                * @param b_num - the number of symbols in the area code(will be in brackets)
                * @type {number}
                */
               b_num = 3,

               /**
                * @param c_num - the number of symbols from closing bracket to hyphen (1 if city, 2 if district, 3 if this is mobile phone)
                * 5 - is 4 symbols at the end of number with 1 symbol - is code of country
                * @type {number}
                */
               c_num = phone_max_length - b_num - 5;

            //if phone has less then 5 symbols return it
            if (phone.length <= 4) {
               return phone;
            }

            if (phone.length >= 10 && (~['7', '8'].indexOf(country_code) || phone.length < 11)) {
               /*if number is with country code and it's Russian code, then we will look at russian region and city codes*/
               /*if number hasn't got country code, we think it's Russia*/
               var

                  /*first symbol. If number is with country code then is 1, else 0: if length is 11 then first symbol is code,
                   * if less than 11 then number hasn't got a code*/
                  firstChar = phone.length - 10,

                  // the list if the city codes in region (code of the region consist of 3 symbols)
                  codeList = phoneCodeModule.region[phone.substr(firstChar, 3)] || [],

                  /* tcode - city code. Can consist of 2 or 3 symbols. For example 494: city code can be '2' or '31'.
                   Suppose that 2 symbols after region code is city,  if not then will check 1 symbol*/
                  tcode = phone.substr(firstChar + 3, 2),
                  m = 0;

               /*determine the offset of code number by city code
                if there is our code from 2 symbols in array, then we indent 2 symbol after region code, else will try to find only first symbol.
                If have found, then indent only one symbol after region code*/

               m = ~codeList.indexOf(tcode) ? 2 : (~codeList.indexOf(tcode.charAt(0)) ? 1 : 0);

               /*the number of symbols in brackets increases by number of symbols in city code (and will be equal to the city code + region code)*/
               b_num += m;

               /*the number of symbols from closing bracket of region code to first hyphen decreases by code of city that will bo located in brackets*/
               c_num -= m;

               /*if there is no symbol before first hyphen then we will separate 3 first symbols*/
               c_num = c_num > 0 ? c_num : 3;

               /*if the length of entering number less than 7 (standard number ***-**-**), then we will ignore region code and city code*/
               b_num = phone_max_length > 7 ? b_num : -1;

               /*if the max length of number less then 10, we take it equal to 10 (the number of symbols without the country code)*/
               phone_max_length = phone_max_length > 10 ? phone_max_length : 10;

               /*place brackets around the code, spaces and hyphens*/
               var
                  re = new RegExp('(?:(\\d]{1,}?))??(?:([\\d]{1,' + b_num + '}?))??(?:([\\d]{1,' + c_num +
                     '}?))??(?:([\\d]{2}))??([\\d]{2})$'),
                  formatted = (phone.toString()).replace(re, function(all, a, b, c, d, e) {
                     return (a || '') + (b ? '(' + b + ') ' : '') + (c ? c + '-' : '') + (d ? d + '-' : '') + e;
                  });

               /*construct number and append it by extra digits
                * if the length of the number is bigger or is equal to maximal russian length append '+', else there is no code there and we don't do anything*/
               phone = ((phone.length >= phone_max_length) ? '+' + formatted : formatted) +
                  (subphone ? ' доб. ' + subphone : '');
            } else if (phoneCodeModule.foreignCodes[country_code]) {
               /*the number of symbols after country code (without +)*/
               var countBeforeSpace = 0;
               if (!phoneCodeModule.foreignCodes[country_code].length) {
                  countBeforeSpace = 1;
               } else if (phoneCodeModule.foreignCodes[country_code].indexOf(phone.substring(1, 3)) >= 0) { //check at first the match with three-digit number
                  countBeforeSpace = 3;
               } else if (phoneCodeModule.foreignCodes[country_code].indexOf(phone.substring(1, 2)) >= 0) { //if three-digit number didn't match, then check two-digit number
                  countBeforeSpace = 2;
               } else {
                  return '+' + phone;
               }

               phone = '+' + phone.substring(0, countBeforeSpace) + ' ' + phone.substring(countBeforeSpace);
            }

            return phone;
         }
      };

      var PhoneDecorator = Control.extend({
         _template: template,

         _formattedNumber: '',

         _beforeMount: function(options) {
            this._formattedNumber = _private.formatPhone(options.number);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.number !== this._options.number) {
               this._formattedNumber = _private.formatPhone(newOptions.number);
            }
         }
      });

      PhoneDecorator.getOptionTypes = function() {
         return {
            number: descriptor(String)
         };
      };

      PhoneDecorator._private = _private;

      return PhoneDecorator;
   }
);
