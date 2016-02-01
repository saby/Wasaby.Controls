define('js!SBIS3.Engine.AdminBasicTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.Engine.AdminBasicTemplate',
   'css!SBIS3.Engine.AdminBasicTemplate',
   'js!SBIS3.CORE.FieldLabel',
   'js!SBIS3.CORE.TemplatedArea'

], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Engine.AdminBasicTemplate
    * @class SBIS3.Engine.AdminBasicTemplate
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend( /** @lends SBIS3.CLOUD.Engine.AdminBasicTemplate.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            title: '',
            config: ''
         }
      },
      $constructor: function() {},

      init: function() {

         moduleClass.superclass.init.call(this);
         var self = this;
         //TODO: Отредактировать html-шаблон, чтобы убрать грязные хаки. Переделать разбор xml на jquery (он вроде умеет кросс-браузерно).

         $.get('service/version.xml').done(function(data) { 
            self.getLinkedContext().setValue('version', (data.getElementsByTagName('version_number')[1].innerHTML || data.getElementsByTagName('version_number')[1].text || data.getElementsByTagName('version_number')[1].textContent) +
               '-' + (data.getElementsByTagName('build_number')[1].innerHTML || data.getElementsByTagName('build_number')[1].text || data.getElementsByTagName('build_number')[1].textContent) +
               ' от ' + (data.getElementsByTagName('build_date')[1].innerHTML || data.getElementsByTagName('build_date')[1].text || data.getElementsByTagName('build_date')[1].textContent));
         }).fail(function() {
            self.getLinkedContext().setValue('version', 'Информация о версии недоступна');
         });
         self.getLinkedContext().setValue("SiteAdress", location.hostname);
         var userObj = $ws.proto.BLObject({
            name: 'САП',
            serviceUrl: '/auth/service/'
         });
         userObj.call(
            "ТекущийПользователь", {},
            $ws.proto.BLObject.RETURN_TYPE_RECORD).addCallback(function(rc) {
            self.getLinkedContext().setValue('userName', rc.get('ВыводимоеИмя') || 'Недоступно');
         }).addErrback(function() {
            self.getLinkedContext().setValue('userName', 'Недоступно')
         });

         document.querySelector('body').style.overflowX = 'hidden';
         $('.cloud_content_area').parent().parent().css({
            position: 'absolute',
            width: '100%'
         });
         this._container.parent().css({
            position: 'absolute',
            width: '100%'
         })
         $('body').css('overflow-y', 'hidden');
         $('#ctr').css('position', 'absolute');
         $('#wrapper').css('position', 'relative');
         $('#min-width').css('min-height', '850px'); // TODO: костыли и грязные хаки

         var timeout = setTimeout(function() {
            $ws.single.NavigationController.setState('AdditionalCloudTemplate', 'null')
         }, 7000);

         this.getChildControlByName("UserNameLabel").subscribe("onClick", function() {
            $('div#cloud_exit').toggle();
         });

         $('#cloud_logo').click(function() {
            window.location = '/';
         });

         $('#cloud_exit').click(function() {
            var obj = $ws.proto.BLObject({
               name: 'САП',
               serviceUrl: '/auth/service/'
            });
            obj.call(
               'Выход', {},
               $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function() {
               document.location.href = '/auth/admin.html';
            });
         });
         $(document).mouseup(function() {
            $('#cloud_exit').hide()
         });
         require(['js!SBIS3.Engine.AdminBasicAccordion'], function(acc) {
            new acc({
               config: self._options.config,
               allowReorder: self._options.allowReorder
            });
         });
      }
   });

   return moduleClass;
});
