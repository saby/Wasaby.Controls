define('Controls/Input/RichArea/plugins/youtube', [
   'Core/helpers/String/escapeHtml',
   'Controls/Input/RichArea/plugins/constants',
   'Controls/Input/RichArea/plugins/content'
], function(escapeHtml, constantsPlugin, contentPlugin) {
   /**
    * Модуль-хелпер для работы с youtube видео
    */

   var YouTubePlugin = {
         addYouTubeVideo: function(self, link) {
            if (!(link && typeof link === 'string')) {
               return false;
            }
            var
               url = escapeHtml(link, []),
               id = _private.getYouTubeVideoId(link);
            if (id) {
               contentPlugin.insertHtml(self, _private.makeYouTubeVideoHtml(url, id));
               return true;
            }
            return false;
         }
      }, _private = {
         getYouTubeVideoId(link) {
            var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            return link.match(p) ? RegExp.$1 : false;
         },
         makeYouTubeVideoHtml: function(url, id) {
            function _byRe(re) {
               var ms = url.match(re);
               return ms ? ms[1] : null;
            }

            var
               protocol = _byRe(/^(https?:)/i) || '',
               timemark = _byRe(/\?(?:t|start)=([0-9]+)/i);
            return [
               '<iframe',
               ' width="' + constantsPlugin.tinyConstants.defaultYoutubeWidth + '"',
               ' height="' + constantsPlugin.tinyConstants.defaultYoutubeHeight + '"',
               ' style="min-width:' + constantsPlugin.tinyConstants.minYoutubeWidth + 'px; min-height:' + constantsPlugin.tinyConstants.minYoutubeHeight +
            'px;"',
               ' src="' + protocol + '//www.youtube.com/embed/' + id + (timemark ? '?start=' + timemark : '') +
            '"',
               ' allowfullscreen',
               ' frameborder="0" >',
               '</iframe>'
            ].join('');
         }
      };

   return YouTubePlugin;
});
