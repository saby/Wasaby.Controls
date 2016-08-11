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
            })
									
            .capture('plain', function (actions) {
				actions.mouseMove(this.image);
				actions.wait(2000);				
				actions.executeJS(function (window) {
                    window.$('[sbisname="ButtonEdit"]').click();					
                });				
				actions.wait(2000);
				actions.waitForElementToShow('[sbisname="applyButton"]', 5000);
				actions.waitForElementToShow('.ws-window-title.controls-EditDialog__title', 5000);
				actions.waitForElementToHide('[sbisname="ButtonEdit"]', 2000);
				actions.executeJS(function (window) {
					window.$('.jcrop-hline').removeClass('jcrop-hline');
					window.$('.jcrop-vline').removeClass('jcrop-vline');
                    window.$('.ws-browser-ajax-loader').addClass('ws-hidden');					
                });				
				actions.wait(1000);
			})
    });
});