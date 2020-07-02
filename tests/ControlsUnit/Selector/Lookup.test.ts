import {Input} from 'Controls/lookup';
import {ok} from 'assert';
import {createSandbox} from 'sinon';
import {RecordSet} from 'Types/collection';
import {Stack} from 'Controls/popup';

function getLookup({closeSuggestCallback}) {
    const lookupControl = new Input();
    lookupControl._lookupController = {
        getItems: () => new RecordSet()
    };
    lookupControl._children = {
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
        const sandBox = createSandbox();
        sandBox.replace(Stack, 'openPopup', () => {
            isSelectorOpened = true;
            return Promise.resolve('123');
        });

        const lookup = getLookup({
            closeSuggestCallback: () => {
                isSuggestClosed = true;
            }
        });

        lookup.showSelector({
            template: 'testTemplate'
        });
        ok(isSelectorOpened);
        ok(isSuggestClosed);
        sandBox.restore();
    });
});
