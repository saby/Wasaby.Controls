gemini.suite('SBIS3.CONTROLS.CompositeViewTile Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_composite_view_tile_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
				
				this.cvl = '[name="CompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.item4 = '[data-id="4"]';
				this.item6 = '[data-id="6"]';
                
				actions.waitForElementToShow(this.cvl, 40000);
				actions.waitForElementToShow(this.input, 5000);						
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item6);
            })
    });
	
	gemini.suite('without_marker', function (test) {

        test.setUrl('/regression_composite_view_tile_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
				
				this.cvl = '[name="CompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.item6 = '[data-id="6"]';
                
				actions.waitForElementToShow(this.cvl, 40000);
				actions.waitForElementToShow(this.input, 5000);						
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item6);
            })
    });
	
	gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_composite_view_tile_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
				
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