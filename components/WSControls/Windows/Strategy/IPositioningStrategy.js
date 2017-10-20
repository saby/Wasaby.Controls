define('js!WSControls/Windows/Strategy/IPositioningStrategy', [],
   function () {
      return {
         getPosition: function(){
            throw new Error('Method getPosition must be implemented');
         }
      };
   }
);
