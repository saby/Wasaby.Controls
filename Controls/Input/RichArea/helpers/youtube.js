define('Controls/Input/RichArea/helpers/youtube', [
   'Core/helpers/String/escapeHtml',
   'Controls/Input/RichArea/helpers/constants',
   'Controls/Input/RichArea/helpers/editor'
], function(escapeHtml, constantsHelper, editorHelper) {
   /**
    * Module which provides work with youtube videos
    */

   var YouTubeHelper = {

         /**
       * Function adds youtube video into current cursor position
       * @param self
       * @param link
       * @returns {boolean}
       */
         addYouTubeVideo: function(self, link) {
            if (!(link && typeof link === 'string')) {
               return false;
            }
            var
               url = escapeHtml(link, []),
               id = _private.getYouTubeVideoId(link);
            if (id) {
               editorHelper.insertHtml(self, _private.makeYouTubeVideoHtml(url, id));
               return true;
            }
            return false;
         }
      }, _private = {
         getYouTubeVideoId: function(link) {
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
               ' width="' + constantsHelper.tinyConstants.defaultYoutubeWidth + '"',
               ' height="' + constantsHelper.tinyConstants.defaultYoutubeHeight + '"',
               ' style="min-width:' + constantsHelper.tinyConstants.minYoutubeWidth + 'px; min-height:' + constantsHelper.tinyConstants.minYoutubeHeight +
            'px;"',
               ' src="' + protocol + '//www.youtube.com/embed/' + id + (timemark ? '?start=' + timemark : '') +
            '"',
               ' allowfullscreen',
               ' frameborder="0" >',
               '</iframe>'
            ].join('');
         }
      };

   return YouTubeHelper;
});
