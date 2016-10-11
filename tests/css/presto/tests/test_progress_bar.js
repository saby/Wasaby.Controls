gemini.suite('SBIS3.CONTROLS.ProgressBar Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_progress_bar_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.pb = '[name="ProgressBar 1"]';
				
                actions.waitForElementToShow(this.pb, 40000);
            })

            .capture('plain')

            .capture('with_progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setEnabled(false);
                });
            })
    });

    gemini.suite('left_align', function (test) {

        test.setUrl('/regression_progress_bar_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.pb = '[name="ProgressBar 1"]';
				
                actions.waitForElementToShow(this.pb, 40000);
            })

            .capture('with_progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })
    });

    gemini.suite('right_align', function (test) {

        test.setUrl('/regression_progress_bar_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.pb = '[name="ProgressBar 1"]';
				
                actions.waitForElementToShow(this.pb, 40000);
            })

            .capture('with_progress', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ProgressBar 1').setProgress(50);
                });
            })
    });
});