/**
 * Interface for Search inputs.
 *
 * @interface Controls/interface/ISearch
 * @public
 * @author Золотова Э.Е.
 */
interface ISearch {
   readonly _options: {
      /**
       * @name Controls/interface/ISearch#searchParam
       * @cfg {String} Name of the field that search should operate on. Search value will insert in filter by this parameter.
       * @example
       * In this example you can search city by typing city name.
       * <pre>
       *    <Controls.suggest:Input minSearchLength="{{2}}" searchParam="city"/>
       * </pre>
       */
      searchParam: string;

      /**
       * @name Controls/interface/ISearch#minSearchLength
       * @cfg {Number} The minimum number of characters a user must type before a search is performed.
       * @remark
       * Zero is useful for local data with just a few items, but a higher value should be used when a single character search could match a few thousand items.
       * @example
       * In this example search starts after typing 2 characters.
       * <pre>
       *    <Controls.suggest:Input minSearchLength="{{2}}" searchParam="city"/>
       * </pre>
       */
      minSearchLength: number;

      /**
       * @name Controls/interface/ISearch#searchDelay
       * @cfg {Number} The delay between when a symbol was typed and when a search is performed.
       * @remark
       * A zero-delay makes sense for local data (more responsive), but can produce a lot of load for remote data, while being less responsive.
       * Value is set in milliseconds.
       * @example
       * In this example search will start after 1s delay.
       * <pre>
       *    <Controls.suggest:Input searchDelay="{{1000}}" searchParam="city"/>
       * </pre>
       */
      searchDelay: number;
   };
}

export default ISearch;
