angular.module('app')
.factory('LocalDB', function() {

  // Base class for using localStorage as a database
  function LocalDB(override) {
    this._itemName = null;
    this._collection = [];
    this._justSet = false;

    // Check localStorage to see if the item exists
    this._init = function() {
      if(!this._itemName) { throw new Error("Please provide an _itemName for local storage!"); }
      if(!this._get()) {
        this._set();
      }
    };

    // Set the localStorage item
    this._set = function() {
      this._collection = this._collection || [];
      var json = angular.toJson(this._collection);
      localStorage.setItem(this._itemName, json);
      this._justSet = true;
    };
    
    // Get the localStorage item
    this._get = function() {
      var json = localStorage.getItem(this._itemName);
      this._collection = angular.fromJson(json);
      this._justSet = false;
      return this._collection;
    };

    // Return the collection
    this.getCollection = function() {
      if(this._justSet) {
        return this._get();
      }
      return this._collection;
    };

    // alias for getCollection
    this.getAll = function() {
      return this.getCollection();
    };

    // Return one item in the collection
    this.getOne = function(data) {
      var result = this.getCollection().filter(function(models) {
        return models.id === data.id;
      });
      return result[0] || null;
    };

    // Add an item to the collection
    this.create = function(model) {
      model.id = this.getCollection().length + 1; 
      this.getCollection().push(model);
      this._set();
    };

    // Update an item in the collection
    this.update = function(data, updatedModel) {
      var model = this.getOne(data);
      angular.extend(model, updatedModel);
      this._set();
    };

    // Remove an item in the collection
    this.destroy = function(data) {
      var index = false;
      this.getCollection().forEach(function(model, i) {
        if(model.id === data.id) {
          index = i;
        }
      });
      if(index !== -1) {
        this.getCollection().splice(index, 1);
      }
      this.getCollection().forEach(function(model, i) {
        model.id = i + 1;
      });
      this._set();
    };

    // Reset the localStorage item
    this.reset = function() {
      localStorage.removeItem(this._itemName);
      this._init();
    };

    // Extend/override if necessary
    angular.extend(this, override);

    // initialize
    this._init();
  }

  // Expose on window.DB for dev
  window.DB = LocalDB;
  return LocalDB;
});