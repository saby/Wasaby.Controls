gemini.suite('SBIS3.CONTROLS.ComboBox Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_combo_box_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.cb = '[name="ComboBox 1"]';
				this.arrow = '.controls-ComboBox__arrowDown';
                this.item1 = '[data-id="1"]';
				this.item2 = '[data-id="2"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.cb, 40000);
                actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_arrow', function (actions) {
                actions.mouseMove(this.arrow)
            })

            .capture('opened', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow(this.item1, 5000);
				actions.waitForElementToShow(this.item2, 5000);
				actions.sendKeys(this.input, 'test');
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item1)
            })

            .capture('checked_item', function (actions) {
                actions.click(this.item1);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 1').setEnabled(false);
                });
				actions.click(this.input);
            })
    });

    gemini.suite('not_editable', function (test) {

        test.setUrl('/regression_combo_box_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.cb = '[name="ComboBox 1"]';
				this.arrow = '.controls-ComboBox__arrowDown';
                this.item1 = '[data-id="1"]';
				this.item2 = '[data-id="2"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.cb, 40000);
                actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow(this.item1, 5000);
				actions.waitForElementToShow(this.item2, 5000);
            })

            .capture('checked_item', function (actions) {
                actions.click(this.item1);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 1').setEnabled(false);
                });
				actions.click(this.input);
            })
    });
	
	gemini.suite('with_autocomplete', function (test) {

        test.setUrl('/regression_combo_box_carry_4.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.cb = '[name="ComboBox 1"]';
				this.box_input = '[name="ComboBox 1"] input';
				this.arrow = '.controls-ComboBox__arrowDown';
                this.item1 = '[data-id="1"]';
				this.item5 = '[data-id="5"]';
				this.item10 = '[data-id="10"]';
				this.item15 = '[data-id="15"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.cb, 40000);
                actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
				actions.sendKeys(this.input, 'test');
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
            })		

            .capture('opened', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow(this.item1, 5000);
				actions.waitForElementToShow(this.item5, 5000);
				actions.waitForElementToShow(this.item10, 5000);
				actions.waitForElementToShow(this.item15, 5000);
            })

            .capture('with_autocomplete', function (actions) {
				actions.sendKeys(this.box_input, 'dev');
                actions.waitForElementToShow(this.item10, 5000);
				actions.waitForElementToShow(this.item15, 5000);
            })
    });
});