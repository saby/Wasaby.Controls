define('js!SBIS3.CONTROLS.DEMO.IntImage2',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.DEMO.IntImage2',
        'js!WS.Data/Source/SbisService',
        'js!SBIS3.CONTROLS.Image',
        'js!SBIS3.CONTROLS.TextBox'
    ],
    function (CompoundControl, dotTplFn, SbisServiceSource) {
        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            init: function () {
                moduleClass.superclass.init.call(this);
                var ds = new SbisServiceSource({
                        endpoint: {contract: 'ImageGallery2'},
                        idProperty: '@ImageGallery2',
                        binding: {
                           create: 'UploadFile',
                           read: 'ReadPicture'
                        }
                    }),
                    data = this.getChildControlByName('Image 1');

                data.setDataSource(ds);
            }
        });
        return moduleClass;
    }
);