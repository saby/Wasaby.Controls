define( "js!SBIS3.Engine.OnlineBaseInner", ["js!SBIS3.Engine.MasterPageController", 'js!SBIS3.NavigationController'], function(master, NavigationController){
   /**
    * Базовый шаблон online/inside.
    * @public
    * @class SBIS3.Engine.OnlineBaseInner
    * @extends SBIS3.Engine.MasterPageController
    */
   return master.extend({
      cells: ["title", "leftAccCompact", "header", "workspace", "helpLink", "navigation"],
      addDeps: ['js!SBIS3.Notes.NotesView', 'js!SBIS3.Notes.DynamicNoteListView', 'js!SBIS3.Engine.UserButton'],
      template: "SBIS3.Engine.OnlineBaseInnerView",
      title: function() {
         return new $ws.proto.Deferred().callback('');
      },

      leftAccCompact: function() {
         var userAgent = (this.req.headers) ? this.req.headers["user-agent"] : "",
            isMobile = (userAgent && /(iPod|iPhone|iPad)/.test(userAgent) && /AppleWebKit/.test(userAgent) && /Mobile\//.test(userAgent)) ||
               (userAgent && /Android/.test(userAgent) && /AppleWebKit/.test(userAgent)),
            result = (this.req.cookies) ?
            ((typeof this.req.cookies["leftAccCompact"] == "undefined" && isMobile) ? "compact-menu" : this.req.cookies["leftAccCompact"]) : "";
         return new $ws.proto.Deferred().callback(result);
      },

      header: function() {
         return new $ws.proto.Deferred().callback('\
         <div id="header">\
         <div id="headerLeft">\
         %{INCLUDE "/Тема Скрепка/Шаблоны/includes/userPanel_template.html"}\
         </div>\
         %{INCLUDE "/Тема Скрепка/Шаблоны/includes/informers.html"}\
         </div>');
      },

      workspace: function(){
         return new $ws.proto.Deferred().callback('');
      },

      helpLink: function(){
         var self = this;
         return new $ws.proto.Deferred().callback((self.req.headers.host.match(/inside.tensor.ru/)) ? 'http://help.inside.tensor.ru' : 'http://help.sbis.ru');
      },

      navigation: function(){
         var
            self = this,
            config = {
               index: false,
               regionId: 'left',
               items: {}
            },
            dNavigation = new $ws.proto.Deferred(),
            accordionName = 'left',
            host = self.req.hostname,
            domain = host.split('.');
         if (domain[domain.length - 1] === 'ua') {
            accordionName = 'leftUA';
         }
         var region = NavigationController && NavigationController.getRegion(accordionName);
         if (region) {
            region.getStructure(self.req).addBoth(function (struct) {

               if (!(struct instanceof Error)) {
                  config.items = struct;
               }
               dNavigation.callback(config);
            });
         } else {
            dNavigation.callback(config);
         }

         var dResult = new $ws.proto.Deferred();
         dNavigation.addCallback(function (config) {
            dResult.callback(self.createComponent('SBIS3.Navigation.LeftNavigation', config));
         });

         return dResult;
      }
   });
});