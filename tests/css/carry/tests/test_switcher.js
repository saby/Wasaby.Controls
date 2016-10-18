gemini.suite('SBIS3.CONTROLS.Switcher Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_switcher_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.switcher = '[name="Switcher 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.switcher, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })

            .capture('state_on', function (actions) {
                actions.click(this.switcher);
            })
			
			.capture('disabled_and_state_on', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_state_off', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(true);
                });
                actions.click(this.switcher);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('Switcher 1').setEnabled(false);
                });
            })
    });
});