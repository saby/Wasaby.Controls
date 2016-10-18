gemini.suite('SBIS3.CONTROLS.Image Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_image_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.image = '[name="Image 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.edit = '[sbisname="ButtonEdit"]';
				this.reset = '[sbisname="ButtonReset"]';
				this.upload = '[sbisname="ButtonUpload"]';
                
				actions.waitForElementToShow(this.image, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
			})
			
			.capture('hovered', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[sbisname="ButtonEdit"]').removeClass('ws-hidden');
					window.$('[sbisname="ButtonReset"]').removeClass('ws-hidden');
                });
				actions.mouseMove(this.image);
				actions.wait(500);
				actions.waitForElementToShow(this.edit, 5000);
				actions.waitForElementToShow(this.reset, 5000);
				actions.waitForElementToShow(this.upload, 5000);
			})
    });
	
	gemini.suite('with_edit_dialog', function (test) {

        test.setUrl('/regression_image_presto_2.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.image = '[name="Image 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.edit = '[sbisname="ButtonEdit"] i';
				this.reset = '[sbisname="ButtonReset"] i';
				this.upload = '[sbisname="ButtonUpload"] i';
				this.apply = '[sbisname="applyButton"]';
				this.close = '.ws-window-title.controls-EditDialog__title'
                
				actions.waitForElementToShow(this.image, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })
									
            .capture('plain', function (actions) {
				actions.mouseMove(this.image)
				actions.wait(500);
				actions.waitForElementToShow(this.edit, 5000);				
				actions.click(this.edit);
				actions.wait(500);
				actions.waitForElementToShow(this.apply, 5000);
				actions.waitForElementToShow(this.close, 5000);
                actions.executeJS(function (window) {
                    window.$('.controls-image__image-bar').addClass('ws-hidden');					
                    window.$('.ws-browser-ajax-loader').addClass('ws-hidden');					
					window.$('.jcrop-hline').removeClass('jcrop-hline');
					window.$('.jcrop-vline').removeClass('jcrop-vline');
                });			
				actions.waitForElementToHide(this.edit, 5000);
			})
    });

	gemini.suite('small_image', function (test) {

        test.setUrl('/regression_image_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.image = '[name="Image 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.edit = '[sbisname="ButtonEdit"]';
				this.reset = '[sbisname="ButtonReset"]';
				this.upload = '[sbisname="ButtonUpload"]';
                
				actions.waitForElementToShow(this.image, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
			})
			
			.capture('hovered', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[sbisname="ButtonEdit"]').removeClass('ws-hidden');
					window.$('[sbisname="ButtonReset"]').removeClass('ws-hidden');
                });
				actions.mouseMove(this.image);
				actions.wait(500);
				actions.waitForElementToShow(this.edit, 5000);
				actions.waitForElementToShow(this.reset, 5000);
				actions.waitForElementToShow(this.upload, 5000);
			})
    });
});