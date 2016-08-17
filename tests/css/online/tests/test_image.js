var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Image Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_image_online.html').setCaptureElements('[sbisname="Image 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Image 1"]', 40000);
                this.image = find('[name="Image 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
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
				actions.wait(1000);
			})
    });
	
	gemini.suite('with_edit_dialog', function (test) {

        test.setUrl('/regression_image_online_2.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Image 1"]', 40000);
                this.image = find('[name="Image 1"] .controls-image__image');
				this.edit = find('.controls-image__image-bar .icon-Edit');
            })
									
            .capture('plain', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[name="Image 1"] .controls-image__image').mouseenter();					
                });
				actions.wait(1000);
				actions.waitForElementToShow('.controls-image__image-bar', 2000);	
				actions.waitForElementToShow('.controls-image__image-bar .icon-Edit', 1000);
				
				actions.executeJS(function (window) {
                    window.$('.controls-image__image-bar .icon-Edit').click();					
                });	
				actions.wait(1000);
				actions.waitForElementToShow('[sbisname="applyButton"]', 2000);
				actions.waitForElementToShow('.ws-window-title.controls-EditDialog__title', 2000);
                actions.executeJS(function (window) {
                    window.$('.controls-image__image-bar').addClass('ws-hidden');					
                    window.$('.ws-browser-ajax-loader').addClass('ws-hidden');					
					window.$('.jcrop-hline').removeClass('jcrop-hline');
					window.$('.jcrop-vline').removeClass('jcrop-vline');
                });			
				actions.waitForElementToHide('.controls-image__image-bar', 2000);	
				actions.waitForElementToHide('.controls-image__image-bar .icon-Edit', 1000);
			})
    });
});