var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Decorators Online', function () {

    gemini.suite('HighlightDecorator', function (test) {

        test.setUrl('/regression_decorators_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
				actions.sendKeys(this.input, 'er');
				actions.wait(1000);
            })
    });
	
	gemini.suite('ColorMarkDecorator', function (test) {

        test.setUrl('/regression_decorators_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
				actions.wait(1000);
            })
    });
	
	gemini.suite('LadderDecorator', function (test) {

        test.setUrl('/regression_decorators_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
				actions.wait(1000);
            })
    });
});