import { Record, adapter } from 'Types/entity';

const SELECTION_FORMAT = [
   {
      name: 'marked',
      type: 'array',
      kink: 'string'
   },
   {
      name: 'excluded',
      type: 'array',
      kink: 'string'
   },
   {
      name: 'type',
      type: 'string',
      kink: 'string'
   },
];

type SelectionType = 'all' | 'leaf' | 'node';

type Selection = {
   selected:Array[string|number],
   excluded:Array[string|number]
}

function prepareArray(array:Array[any]):Array[string] {
   return array.map(function(value) {
      return value !== null ? '' + value : value;
   });
}

function getSelectionRecord(selection:Selection, adapter:adapter.IAdapter, selectionType:SelectionType = 'all'):Record {
   var result = new Record({
      adapter: adapter,
      format: SELECTION_FORMAT
   });

   result.set('marked', prepareArray(selection.selected));
   result.set('excluded', prepareArray(selection.excluded));
   result.set('type', selectionType);

   return result;
}

export = getSelectionRecord;

