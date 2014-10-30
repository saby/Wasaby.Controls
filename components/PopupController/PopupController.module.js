define ('js!SBIS3.CONTROLS.PopupController', [], function(){

   return {
      zIndexManager : {
         _cur: 100499,
         setFree: function (zIndex) {
            zIndex = parseInt(zIndex, 10);
            if (zIndex == this._cur) {
               this._cur--;
            }
            return this._cur;
         },
         getNext: function () {
            this._cur++;
            return this._cur;
         }
      },

      closeManager : {
         _popupsIndex : [],
         _cur: 0,
         addToIndex: function(popup){

            this._popupsIndex[this._cur] = popup;
            this._cur++;
         },
         removeFromIndex: function(){
            this._popupsIndex.splice(this._cur - 1, 1);
            if (this._cur !== 0){
               this._cur--;
            }
         },

         checkChildrens: function(){

         }
      }
   };

});