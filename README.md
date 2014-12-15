## local-db
Angular factory for using localStorage as a temporary database. Simply inject LocalDB into any angular provider. It
also exposes LocalDB on window.DB for dev purposes.

## Usage
```javascript
var db = new LocalDB({ _itemName: "people" });
db.create({
  name: "John"
}).then(function(person) {
  // person.name === "John"
});

var john;
db.getOne({id: 1}).then(function(person) {
  // person.name === "John"
  john = person;
});

john.age = 26;
db.update(john).then(function(person) {
  // person.age === 26
})

db.getAll().then(function(people) {
  // people is an array of people
});

db.destroy(john).then(function(id) {
  // id === 1
});

```

You can also turn promises off and run each method synchronously.

```javascript
var db = new DB({ _itemName: "people", usePromises: false });
var person = db.getOne({id: 1});
```
