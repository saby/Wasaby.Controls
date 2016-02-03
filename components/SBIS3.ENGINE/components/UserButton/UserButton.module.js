define('js!SBIS3.Engine.UserButton',
      [
         'js!SBIS3.CORE.CompoundControl',
         'html!SBIS3.Engine.UserButton',
         'preload!js!SBIS3.AccountsManagement.UserPanel',
         'js!SBIS3.CORE.LinkButton',
         'css!SBIS3.Engine.UserButton'
      ],
      function(CompoundControl, dotTplFn) {
         var UserButton = CompoundControl.extend({
            $protected: {
               _options: {
                  name: 'UserLinkButton'
               }
            },
            _dotTplFn: dotTplFn,

            $constructor: function () {
            },

            init: function () {
               UserButton.superclass.init.call(this);

               var self = this,
                     channel = $ws.single.EventBus.channel('ChannelUserAccount'),
                     userLinkButton = self.getChildControlByName('UserNameLinkButton'),
                     opts = {
                        userName : '',
                        isDemouserTemplate : self._options.isDemouserTemplate,
                        isDemoUser: self._options.isDemoUser,
                        hasMoreAccounts : self._options.hasMoreAccounts
                     },
                     $indicator = self.getContainer().find('.UserButton__indicator');
               if(userLinkButton) {
                  userLinkButton.subscribe('onActivated', function () {
                     channel.notify('onUserButtonPressed');
                  });
                  opts.userName = userLinkButton.getCaption();
               }

               channel.subscribe('onUserButtonPressed', function () {
                  require(['js!SBIS3.AccountsManagement.UserPanel'],
                     function(){
                        $ws.helpers.showFloatArea({
                           autoWidth: true,
                           autoHeight: true,
                           opener: userLinkButton,
                           name: "UserPanelFloatArea",
                           template: "js!SBIS3.AccountsManagement.UserPanel",
                           target: $('.user-button-component'),
                           side: 'right',
                           componentOptions: opts
                        }).addCallback(function (floatArea) {
                           // если есть текст, значит есть активные приглашения
                           if($indicator.text()) {
                              $ws.proto.BLObject('Приглашение').call('СбросСчетчикаАктивных',
                                    {},
                                    $ws.proto.BLObject.RETURN_TYPE_ASIS
                              ).addCallback(
                                    function(){
                                       $indicator.html('').hide();
                                    }
                              );
                           }
                           return floatArea;
                        });
                     },
                     function(e){
                        $ws.single.ioc.resolve('ILogger').error(e);
                     }
                  );
               });

               $ws.single.EventBus.channel('PersonProfile').subscribe(
                     'onDataSynchronization',
                     function(e, args) {
                        if (args.eventName === 'PersonInitialsChanged' && args.data) {
                           var newName = args.firstName + ' ' + (args.name ? args.name[0] + '.' : '') + (secondName.name ? secondName.name[0] + '.' : '');
                           userLinkButton.setCaption(newName);
                           $ws.single.EventBus.channel('ChannelUserAccount').notify('onUserNameChanged', newName);
                           $ws.proto.BLObject('Preprocessor')
                                 .call('cacheDelete', {keys: [$.cookie('sid').replace(/\-[\w]*$/g, '')]}, 'asis');
                        }
                     }
               );

               // вывод количества активных приглашений
               self.getActiveInvite($indicator);
            },

            /**
             * Метод определяет количество активных приглашений и если они имеются,
             * то выводит и показывает число в оранжевом круге
             * @param {jQuery} $circle - оранжевый круг
             */
            getActiveInvite: function ($circle) {
               var blInvite = $ws.proto.BLObject('Приглашение'),
                  blParams = {};

               blInvite.call('Активные', blParams, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(
                  function (count) {
                     if(count) {
                        $circle.html(count > 99 ? '99' : count).show();
                     } else {
                        $circle.html('').hide();
                     }
                  },
                  function (e) {
                     $ws.single.ioc.resolve('ILogger').error(e);
                  }
               );
            }
         });
         return UserButton;
      }
);