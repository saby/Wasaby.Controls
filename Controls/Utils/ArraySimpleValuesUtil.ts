/**
 * Утилита для простых операция с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 */
interface IDifferenceArrays {
   added: Array,
   removed: Array
}

export = {
   addSubArray: function(array: Array, items: Array): Array {
      items.forEach((item) => {
         if (!this.hasInArray(array, item)) {
            array.push(item);
         }
      });

      return array;
   },

   removeSubArray: function(array: Array, items: Array): Array {
      let index: number;
      items.forEach((item) => {
         index = this.invertTypeIndexOf(array, item);
         if (index !== -1) {
            array.splice(index, 1);
         }
      });

      return array;
   },

   /**
    * Сравнивает два массива, возвращает разницу между ними
    * @param arrayOne
    * @param arrayTwo
    * @returns {{added: Array, removed: Array}}
    */
   getArrayDifference: function(arrayOne: Array, arrayTwo: Array): IDifferenceArrays {
      let result: IDifferenceArrays = {};

      result.removed = arrayOne.filter((item) => {
         return !this.hasInArray(arrayTwo, item);
      });

      result.added = arrayTwo.filter((item) => {
         return !this.hasInArray(arrayOne, item);
      });

      return result;
   },

   hasInArray: function(array: Array, elem: any): boolean {
      return this.invertTypeIndexOf(array, elem) !== -1;
   },

   invertTypeIndexOf: function(array: Array, elem: any): number {
      let index: number = array.indexOf(elem);

      if (index === -1) {
         elem = (typeof elem === 'string') ? Number(elem) : String(elem);
         index = array.indexOf(elem);
      }

      return index;
   },

   getIntersection: function(firstCollection, secondCollection) {
      return firstCollection.filter((key) => {
         return secondCollection.includes(key);
      });
   }
};
