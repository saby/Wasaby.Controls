gemini.suite('SBIS3.CONTROLS.SwitcherDouble Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_switcher_double_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.sw = '[name="Switcher 1"]';
				this.switcher = '[name="Switcher 1"] .controls-SwitcherDouble__toggle';
                this.unselected = '.controls-SwitcherDouble__unselected';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.sw, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('toggled', function (actions) {
                actions.click(this.switcher);
            })

            .capture('hovered_unselected', function (actions) {
                actions.mouseMove(this.unselected);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(false);
                });
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_switcher_double_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.sw = '[name="Switcher 1"]';
				this.switcher = '[name="Switcher 1"] .controls-SwitcherDouble__toggle';
                this.unselected = '.controls-SwitcherDouble__unselected';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.sw, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('toggled', function (actions) {
                actions.click(this.switcher);
            })			
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(false);
                });
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_switcher_double_carry_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.sw = '[name="Switcher 1"]';
				this.switcher = '[name="Switcher 1"] .controls-SwitcherDouble__toggle';
                this.unselected = '.controls-SwitcherDouble__unselected';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.sw, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain')
    });
});