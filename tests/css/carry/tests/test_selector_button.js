gemini.suite('SBIS3.CONTROLS.SelectorButton Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_selector_button_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[sbisname="SelectorButton 1"]';
                this.input = '[sbisname="TextBox 4356"] input';
				this.text = '.controls-SelectorButton__text';
				this.cross = '.controls-SelectorButton__cross';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
			
			.capture('hovered', function (actions) {
				actions.mouseMove(this.button);
            })
			
			.capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').setSelectedKeys([0])
                });
				actions.click(this.input);
            })

            .capture('hovered_text', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove(this.cross);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').setEnabled(false);
                });
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('SelectorButton 1').setEnabled(true);
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').markControl();
                });
            })
    });

	gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_selector_button_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[sbisname="SelectorButton 1"]';
                this.input = '[sbisname="TextBox 4356"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })
			
			.capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').setSelectedKeys([0, 1, 2])
                });
				actions.click(this.input);
            })
    });

    gemini.suite('with_max_width', function (test) {

        test.setUrl('/regression_selector_button_carry_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[sbisname="SelectorButton 1"]';
                this.input = '[sbisname="TextBox 4356"] input';
                
				actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })


			.capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SelectorButton 1').setSelectedKeys([0])
                });
				actions.click(this.input);
            })
    });
});