/**
 * Created by rn.kondakov on 15.02.2019.
 */
define('Controls/Decorator/Markup/resources/linkDecorateConstants', [
   'Env/Env'
], function(Env) {
   'use strict';

   return {
      getClasses: function() {
         return {
            wrap: 'LinkDecorator__wrap',
            link: 'LinkDecorator__linkWrap',
            image: 'LinkDecorator__image'
         };
      },
      getService: function() {
         return Env.constants.decoratedLinkService;
      },
      getMethod: function() {
         return 'LinkDecorator.DecorateAsSvg';
      },
      getHrefMaxLength: function() {
         return 1499;
      }
   };
});
