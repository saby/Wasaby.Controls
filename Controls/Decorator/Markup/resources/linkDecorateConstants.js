/**
 * Created by rn.kondakov on 15.02.2019.
 */
define('Controls/Decorator/Markup/resources/linkDecorateConstants', [
   'Env/Env'
], function(Env) {
   'use strict';

   return {
      classes: {
         wrap: 'LinkDecorator__wrap',
         link: 'LinkDecorator__linkWrap',
         image: 'LinkDecorator__image'
      },
      service: Env.constants.decoratedLinkService,
      method: 'LinkDecorator.DecorateAsSvg',
      hrefMaxLength: 1499
   };
});
