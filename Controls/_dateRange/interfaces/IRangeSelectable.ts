import {descriptor} from 'Types/entity';

/**
 * Интерфейс контролов позволяющих выделять интервалы от одного значения до другого
 * mixin Controls/_dateRange/interfaces/IRangeSelectable
 */
var selectionTypes = {
    range: 'range',
    single: 'single',
    quantum: 'quantum',
    disable: 'disable'
};

export default {
    getDefaultOptions: function () {
        return {

            // TODO: имеет ли смысл оставлять опуию selectionType? selectionType: 'single', это частный случай quantum: {days: [1]}
            // Возможно стоит оставить, но ввести selectionType: 'quantum' и сделать что бы опция quantum работала только в этом случае.
            /**
             * @name Controls/_dateRange/interfaces/IRangeSelectable#selectionType
             * @cfg {String} Определяет режим выделения диапазано
             * @variant 'range' режим выделения произвольного диапазона
             * @variant 'single' режим выделения одного элемента
             * @variant 'disable' режим выбора отключен
             */
            selectionType: 'range'
        };
    },

    SELECTION_TYPES: selectionTypes,

    getOptionTypes: function () {
        return {
            selectionType: descriptor(String).oneOf(Object.keys(selectionTypes))
        };
    }
};
