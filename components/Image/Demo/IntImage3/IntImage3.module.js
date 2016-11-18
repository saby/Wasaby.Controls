define('js!SBIS3.CONTROLS.DEMO.IntImage3',
	[
		'js!SBIS3.CORE.CompoundControl',
		'html!SBIS3.CONTROLS.DEMO.IntImage3',
		'js!WS.Data/Source/SbisService',
		'js!SBIS3.CONTROLS.Image',
		'js!SBIS3.CONTROLS.TextBox',
		'js!SBIS3.CONTROLS.Button'
	],
    function (CompoundControl, dotTplFn, SbisServiceSource) {
        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            init: function () {
                moduleClass.superclass.init.call(this);
                var ds = new SbisServiceSource({
                    endpoint: 'ImageGallery',
                    idProperty: '@ImageGallery',
                    binding: {
                        create: 'UploadFile',
                        read: 'ReadPicture',
                        write: 'WritePicture',
                        update: 'CropPicture',
                        destroy: 'DeletePicture'
                    }
                }),
                imgEdit = this.getChildControlByName('Image 1');
                imgEdit.setDataSource(ds);
            }
        });
      return moduleClass;
    }
);