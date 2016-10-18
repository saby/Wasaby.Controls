gemini.suite('SBIS3.CONTROLS.NumberTextBox Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_number_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.number_input = '[name="NumberTextBox 1"] input';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.number_input, 40000);
				actions.waitForElementToShow(this.input, 5000);				
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
			
			.capture('with_text', function (actions) {
                actions.sendKeys(this.number_input, '150');
				actions.click(this.input);
            })

			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('NumberTextBox 1').setEnabled(false);
                });
				actions.click(this.input);
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('NumberTextBox 1').setEnabled(true);
                    window.$ws.single.ControlStorage.getByName('NumberTextBox 1').markControl();
                });
            })
    });

    gemini.suite('right_align', function (test) {

        test.setUrl('/regression_number_text_box_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.number_input = '[name="NumberTextBox 1"] input';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.number_input, 40000);
				actions.waitForElementToShow(this.input, 5000);								
            })

            .capture('plain', function (actions) {
                actions.sendKeys(this.number_input, '150');
				actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('NumberTextBox 1').setEnabled(false);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('with_arrows', function (test) {

        test.setUrl('/regression_number_text_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.number_input = '[name="NumberTextBox 1"] input';
				this.input = '[sbisname="TextBox 1"] input';
				this.up = '.controls-NumberTextBox__arrowUp';
                this.down = '.controls-NumberTextBox__arrowDown';
                
				actions.waitForElementToShow(this.number_input, 40000);
				actions.waitForElementToShow(this.input, 5000);				
            })

            .capture('plain', function (actions) {
                actions.sendKeys(this.number_input, '150');
				actions.click(this.input);
            })

            .capture('hovered_up', function (actions) {
                actions.mouseMove(this.up);
            })

            .capture('hovered_down', function (actions) {
                actions.mouseMove(this.down);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('NumberTextBox 1').setEnabled(false);
                });
				actions.click(this.input);
            })
    });
});