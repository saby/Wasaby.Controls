gemini.suite('SBIS3.CONTROLS.CompositeViewList Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_composite_view_list_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.cvl = '[name="CompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.item4 = '[data-id="Trusty Tahr"]';
				this.item6 = '[data-id="Raring Ringtail"]';
				this.delete_btn = '[data-id="delete"]';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.cvl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
				actions.waitForElementToShow(this.delete_btn, 5000);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item6);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_composite_view_list_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.cvl = '[name="CompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.cvl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setEnabled(false);
                });
            })
    });
});