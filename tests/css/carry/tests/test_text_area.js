gemini.suite('SBIS3.CONTROLS.TextArea Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_text_area_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.ta = '[name="TextArea 1"]';
				this.input = '.controls-TextArea__inputField';
                this.focus_input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.ta, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'TextArea');
				actions.click(this.focus_input);
            })

            .capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(false);
                });
            })			
						
			.capture('with_scroll', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(true);
                });
				actions.click(this.input);
                actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Tensor');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Flow');
            })
			
			.capture('validation_error', function (actions) {
				actions.click(this.focus_input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').markControl();
                });
            })
    });

    gemini.suite('set_min_lines_count', function (test) {

        test.setUrl('/regression_text_area_carry_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.ta = '[name="TextArea 1"]';
				this.input = '.controls-TextArea__inputField';
                this.focus_input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.ta, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('set_min_lines', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setMinLinesCount(2);
                });
				actions.click(this.focus_input);
            })

			.capture('with_text', function (actions) {
                actions.click(this.input);
				actions.sendKeys(this.input, 'какой-то текст и быть может что-то больше');
                actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
            })
    });

    gemini.suite('with_autoheight', function (test) {

        test.setUrl('/regression_text_area_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.ta = '[name="TextArea 1"]';
				this.input = '.controls-TextArea__inputField';
                this.focus_input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.ta, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'TextArea Test');
				actions.click(this.focus_input);
            })
    });
	
	gemini.suite('with_min_lines_count', function (test) {

        test.setUrl('/regression_text_area_carry_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.ta = '[name="TextArea 1"]';
				this.input = '.controls-TextArea__inputField';
                this.focus_input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.ta, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })
						
			.capture('with_scroll', function (actions) {
                actions.click(this.input);
				for (var i = 0; i < 18; i++) {
					actions.sendKeys(this.input, i.toString());
					actions.sendKeys(this.input, gemini.ENTER);
				}
				actions.sendKeys(this.input, gemini.TAB);
            })
			
			.capture('with_scroll_and_disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(false);
                });
            })
    });
});