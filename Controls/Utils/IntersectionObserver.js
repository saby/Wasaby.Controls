define('Controls/Utils/IntersectionObserver',
   [
      'Core/core-simpleExtend'
   ],
   function(simpleExtend) {

      'use strict';

      var IntersectionObserver = window.IntersectionObserver || simpleExtend.extend({
         observe: function() {
               
         }
      });
      
      return IntersectionObserver;
   });
