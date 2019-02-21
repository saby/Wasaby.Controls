define('Controls-demo/resources/Images', [
   'Env/Env'
], function(Env) {
   'use strict';

   return {
      staff: {
         dogadkin: Env.constants.resourceRoot + 'Controls-demo/resources/images/dogadkin.png',
         kesareva: Env.constants.resourceRoot + 'Controls-demo/resources/images/kesareva.png',
         korbyt: Env.constants.resourceRoot + 'Controls-demo/resources/images/korbyt.png',
         krainov: Env.constants.resourceRoot + 'Controls-demo/resources/images/krainov.png',
         baturina: Env.constants.resourceRoot + 'Controls-demo/resources/images/baturina.png'
      },
      groups: {
         comics: Env.constants.resourceRoot + 'Controls-demo/resources/images/comics.png',
         board: Env.constants.resourceRoot + 'Controls-demo/resources/images/board.png',
         sport: Env.constants.resourceRoot + 'Controls-demo/resources/images/sport.png',
         standards: Env.constants.resourceRoot + 'Controls-demo/resources/images/standards.png',
         development: Env.constants.resourceRoot + 'Controls-demo/resources/images/development.png',
         release: Env.constants.resourceRoot + 'Controls-demo/resources/images/release.png',
         sbis: Env.constants.resourceRoot + 'Controls-demo/resources/images/sbis.png',
         mili: Env.constants.resourceRoot + 'Controls-demo/resources/images/mili.png'
      },
      tile: {
         tile1: Env.constants.resourceRoot + 'Controls-demo/resources/images/tile1.jpg',
         tile2: Env.constants.resourceRoot + 'Controls-demo/resources/images/tile2.jpg',
         tile3: Env.constants.resourceRoot + 'Controls-demo/resources/images/tile3.jpg',
         tile4: Env.constants.resourceRoot + 'Controls-demo/resources/images/tile4.jpg',
         tile5: Env.constants.resourceRoot + 'Controls-demo/resources/images/tile5.jpg'
      }
   };
});
