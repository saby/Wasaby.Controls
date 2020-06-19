import {Input} from 'Controls/lookup';
import {ok} from 'assert';

function getLookup({showSelectorCallback, closeSuggestCallback}) {
    const lookupControl = new Input();
    lookupControl._children = {
        controller: {
            showSelector: () => {
                showSelectorCallback();
            }
        },
        view: {
            closeSuggest: () => {
                closeSuggestCallback();
            }
        }
    };
    return lookupControl;
}

describe('lookup', () => {
    it('showSelector', () => {
        let isSuggestClosed = false;
        let isSelectorOpened = false;

        const lookup = getLookup({
            showSelectorCallback: () => {
                isSelectorOpened = true;
            },
            closeSuggestCallback: () => {
                isSuggestClosed = true;
            }
        });

        lookup.showSelector();
        ok(isSelectorOpened);
        ok(isSuggestClosed);
    });
});