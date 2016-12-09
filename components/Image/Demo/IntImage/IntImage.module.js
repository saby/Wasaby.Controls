define('js!SBIS3.CONTROLS.DEMO.IntImage',
	[
		'js!SBIS3.CORE.CompoundControl',
		'html!SBIS3.CONTROLS.DEMO.IntImage',
		'js!WS.Data/Source/SbisService',
		'js!SBIS3.CONTROLS.Image.CropPlugin',
		'js!SBIS3.CONTROLS.Image',
		'js!SBIS3.CONTROLS.TextBox',
		'js!SBIS3.CONTROLS.Button'
	],
    function (CompoundControl, dotTplFn, SbisServiceSource, CropPlugin) {
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
                    imgCrop = this.getChildControlByName('Image 1'),
                    imgEdit = this.getChildControlByName('Image 2'),
                    imgNotBar= this.getChildControlByName('Image 3'),
                    imgDefault= this.getChildControlByName('Image 4');
                imgCrop.setDataSource(ds);
                imgEdit.setDataSource(ds);
                imgNotBar.setDataSource(ds);
                imgDefault.setDataSource(ds);

                this.getChildControlByName('Button 1').subscribe('onActivated', function (eventObject) {
                    imgEdit.setDataSource(ds);
                    imgNotBar.setDataSource(ds);
                    imgDefault.setDataSource(ds);
                });

                imgCrop.subscribe('onDataLoaded', function(){
                    var cropPlugin = new CropPlugin({
                        image: imgCrop.getContainer().find('img')
                    });
                    cropPlugin.startCrop();
                });
            }
        });
    return moduleClass;
});