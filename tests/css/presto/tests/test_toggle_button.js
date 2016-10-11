gemini.suite('SBIS3.CONTROLS.ToggleButton Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_toggle_button_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="ToggleButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('big', function (test) {

        test.setUrl('/regression_toggle_button_presto_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="ToggleButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('with_icon16', function (test) {

        test.setUrl('/regression_toggle_button_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="ToggleButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('with_icon24', function (test) {

        test.setUrl('/regression_toggle_button_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="ToggleButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
			
			.capture('disabled_and_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('disabled_and_primary_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })
			
			.capture('disabled_and_hovered_primary', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('primary_and_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(true);
                });
            })
			
			.capture('primary_and_hovered', function (actions) {
                actions.click(this.button);
				actions.click(this.input);
				actions.mouseMove(this.button);
            })
			
			.capture('disabled_base', function (actions) {
                actions.click(this.input);
				actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(false);
					window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })
    });

    gemini.suite('big_with_icon16', function (test) {

        test.setUrl('/regression_toggle_button_presto_5.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="ToggleButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('big_with_icon24', function (test) {

        test.setUrl('/regression_toggle_button_presto_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="ToggleButton 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button);
            })

            .capture('checked', function (actions) {
                actions.click(this.button);
            })
			
			.capture('disabled_and_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('disabled_and_primary_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(true);
                });
            })
			
			.capture('disabled_and_hovered_primary', function (actions) {
                actions.mouseMove(this.button);
            })
			
			.capture('primary_and_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(true);
                });
            })
			
			.capture('primary_and_hovered', function (actions) {
                actions.click(this.button);
				actions.click(this.input);
				actions.mouseMove(this.button);
            })
			
			.capture('disabled_base', function (actions) {
                actions.click(this.input);
				actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('ToggleButton 1').setPrimary(false);
					window.$ws.single.ControlStorage.getByName('ToggleButton 1').setEnabled(false);
                });
            })
    });
});