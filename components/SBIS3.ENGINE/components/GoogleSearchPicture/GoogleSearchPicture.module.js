/**
 * https://developers.google.com/image-search/v1/devguide
 * по поисковому слову возвращает ссылку на 64 рисунка
 */
define('js!SBIS3.Engine.GoogleSearchPicture', [
   'is!browser?js!SBIS3.Engine.GoogleSearchPicture/resources/jsapi'
], function () {
   var
      imageSearch,
      counterSearch,
      callBackHandler;

   return GoogleSearchPicture = {
      // получение поискового слова
      searchPictures: function (val, callBack) {
         callBackHandler = callBack;
         google.load('search', '1', {"callback": function () {
            GoogleSearchPicture.onLoad(val);
         }});
         counterSearch = 0;
      },

      autoLoad: function auto() {
         counterSearch++;
         imageSearch.gotoPage(counterSearch);
         if (counterSearch < 8) setTimeout(auto, 350);
      },

      onLoad: function (val) {
         imageSearch = new google.search.ImageSearch();
         imageSearch.setResultSetSize(8);
         imageSearch.setSearchCompleteCallback(this, GoogleSearchPicture.searchComplete, null);
         imageSearch.execute(val);
         GoogleSearchPicture.autoLoad();
      },

      // отправка ссылок на найденные рисунки
      searchComplete: function () {
         callBackHandler(imageSearch.results);
      }

   };

});