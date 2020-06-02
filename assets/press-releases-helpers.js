/*
* Push an object to the array, if the array does not contain an object 
* with the same key already
*/
Array.prototype.pushUnique = function (key, value) {
    var found = false;
    $.each(this, function (index, item) {
        if (item.Name === key) {
            found = true;
        }
    });
    if (!found) {
        this.push(value)
    }
};

Array.prototype.toHashTable = function (key) {
    var hashTable = new HashTable();
    $.each(this, function (index, item) {
        hashTable.addItem(item[key], item);
    });
    return hashTable;
};

Array.prototype.mapValue = function (valueKey) {
    return $.map(this, function (e, i) {
        return e[valueKey];
    });
};


/*
* Parse a date from a string like /Date(1234560)/.
*/
Date.parseJsonDate = function(str) {
    return new Date(parseInt(str.replace(/[^0-9 +]/g, '')));
};


/*
* HASHTABLE
* Helps to handle keys with items 
*/
function HashTable()
{
    this._table = {};
};

HashTable.prototype.addItem = function(key, item) {
    this._table[key] = item;
};

HashTable.prototype.getItem = function (key) {
    return this._table[key];
};

HashTable.prototype.listItems = function (keys) {
    var self = this;
    var items = [];
    $.each(keys, function (i, key) {
        if (self._table[key] != null) {
            items.push(self._table[key]);
        }       
    });
    return items;
};