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
});