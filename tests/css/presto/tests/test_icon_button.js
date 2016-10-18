gemini.suite('SBIS3.CONTROLS.IconButton Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_icon_button_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.icon_button = '[name="IconButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.icon_button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('round_border_plus', function (test) {

        test.setUrl('/regression_icon_button_presto_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.icon_button = '[name="IconButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.icon_button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('round_border', function (test) {

        test.setUrl('/regression_icon_button_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.icon_button = '[name="IconButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.icon_button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_icon_button_presto_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.icon_button = '[name="IconButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.icon_button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon_button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.icon_button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.icon_button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('IconButton 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.icon_button);
            })
    });

    gemini.suite('round_border_with_icon24', function (test) {

        test.setUrl('/regression_icon_button_presto_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.icon_button = '[name="IconButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.icon_button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.icon_button);
            })

            .capture('actived', function (actions) {
                actions.mouseDown(this.icon_button);
            })

            .capture('disabled', function (actions) {
                actions.mouseUp(this.icon_button);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('IconButton 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.icon_button);
            })
    });
});