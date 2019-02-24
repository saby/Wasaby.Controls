const FILTER_SELECTION_FIELD = 'selection';
const SELECTION_MARKED_FIELD = 'marked';


/**
 * Function that used for filtering {@link Types/_source/Memory} with selection in query filter.
 * @param {item} item
 * @param {Object} filter
 * @param {String} idProperty
 * @example
 * var myMemory = new Memory({
 *     data: myData,
 *     idProperty: 'id',
 *     filter: function(item, filter) {
 *         return memorySourceFilter(item, filter, 'id');
 *     }
 * })
 * @returns {Boolean}
 */
function filter(item, filter : Object, idProperty : String) : Boolean {
   let result : Boolean = true;
   let hasIdInMarked : Boolean = false;

   if (filter[FILTER_SELECTION_FIELD]) {
      let itemId = item.get(idProperty);
      filter[FILTER_SELECTION_FIELD].get(SELECTION_MARKED_FIELD).forEach(markedId => {
         if (!hasIdInMarked && markedId == itemId) {
            hasIdInMarked = true;
         }
      });
      result = hasIdInMarked;
   }

   return result;
}

export = filter;
