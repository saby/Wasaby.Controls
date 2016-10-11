gemini.suite('SBIS3.CONTROLS.Decorators Presto', function () {

    gemini.suite('HighlightDecorator', function (test) {

        test.setUrl('/regression_decorators_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tcv = '[sbisname="TreeCompositeView 1"]';
                this.input = '[name="TextBox 1"] input';
				this.highlight = '.controls-HtmlDecorators-highlight';
				
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
				actions.sendKeys(this.input, 'er');
				actions.waitForElementToShow(this.highlight, 5000);
            })
    });
	
	gemini.suite('ColorMarkDecorator', function (test) {

        test.setUrl('/regression_decorators_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tcv = '[sbisname="TreeCompositeView 1"]';
                this.input = '[name="TextBox 1"] input';
				
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('LadderDecorator', function (test) {

        test.setUrl('/regression_decorators_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tcv = '[sbisname="TreeCompositeView 1"]';
                this.input = '[name="TextBox 1"] input';
				
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
});