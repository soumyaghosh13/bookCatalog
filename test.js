var test = {};
var assert = require('assert');
var catalog = require('./bookcatalog_lib.js').catalog;
var mocks = {};
mocks.data = '';
mocks.writeFileSync= function(filename,text)
{
	  mocks.data = text;
};
mocks.readFileSync = function(filename,encoding)
{
   return mocks.data;
};
catalog.fs = mocks;

test._1_convert_string_to_hash = function(){
   var expected = "500";
   var actual = "isbn:12345;price:500;author:Soumya Ghosh;title:Me&Myself;publisher:NoOne Publishers";
   var returned_hash = catalog.stringToHash(actual);
   console.log('coming',returned_hash);
   assert.deepEqual(expected,returned_hash["12345"].price);
};

test._2_add_record_when_inventory_is_blank = function()
{
   var actual = "isbn:12345;price:500;author:Soumya Ghosh;title:Me&Myself;publisher:NoOne Publishers";
   catalog.add_record(actual);
   var record = JSON.parse(mocks.data);
   assert.equal('12345',record["12345"].isbn);
};

test._3_add_new_record_to_inventory_when_previous_record_is_exist = function()
{
   var hash = {"12345":{isbn:"12345",price:"500",author:"Soumya",title:"C",publisher:"pearson"}}
   mocks.data = JSON.stringify(hash);
   var actual = "isbn:12347;price:900;author:Ghost;title:Me;publisher:NoOne";
   catalog.add_record(actual);
   var new_records = JSON.parse(mocks.data);
   assert.equal("Ghost",new_records["12347"]["author"]);
};

test._4_list_record_from_inventory = function(){
	mocks.data = JSON.stringify({"12345":{"isbn":"12345","price":"500","author":"Soumya Ghosh","title":"Me&Myself","publisher":"NoOne Publishers"},
    "12347":{isbn:"1234x",price:"700",author:"lara",title:"C++",publisher:"sons"}});
	var list = catalog.list_record();
   assert.equal(2,list.length);
};

test._5_remove_record_should_throw_an_error_if_inventory_is_empty = function(){
   mocks.data = "";
   var expected = "there are no records to remove";
   var isbn = "1234";
   assert.equal(expected,catalog.remove_record(isbn));
};
test._6_remove_record_should_remove_record_based_on_isbn_value = function()
{
   var hash = {"12345":{isbn:"12345",price:"500",author:"Soumya",title:"C",publisher:"pearson"},
               "12347":{isbn:"1234x",price:"700",author:"lara",title:"C++",publisher:"sons"}};
   mocks.data = JSON.stringify(hash);
   var isbn = "12345";
   catalog.remove_record(isbn);
   var inventory_record = JSON.parse(mocks.data);
   assert.equal(1,Object.keys(inventory_record).length);
};
test._7_get_isbn_should_return_isbn_value  = function(){
   var actual = "isbn:12347;price:900;author:Ghost;title:Me;publisher:NoOne";
   var expected = "12347";
   assert.equal(expected,catalog.get_isbn(actual));
};

test._8_check_isbn_should_return_error_message_if_inventory_is_empty = function()
{
   mocks.data = "";
   assert.equal(false,catalog.check_isbn("123"));
};

test._9_check_isbn_should_return_true_if_same_isbn_exists = function()
{
  var record_hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio"},};
   mocks.data = JSON.stringify(record_hash);
   assert.equal(true,catalog.check_isbn("123"));
};

test._10_check_isbn_should_return_false_if_different_isbn_exists = function()
{
  var record_hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio"},};
   mocks.data = JSON.stringify(record_hash);
   assert.equal(false,catalog.check_isbn("12x"));
};

test._11_search_by_string_in_empty_file_should_return_error_message = function()
{
    mocks.data = "";
    var expected = "no records to search";
    assert.equal(expected,catalog.default_search("paulo"));  
};

test._12_search_by_string_under_all_book_attributes_and_return_record = function()
{
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var search_string = "Prince";
   var records = catalog.default_search(search_string);
   assert.equal(2,records.length);

};

test._13_search_by_string_under_all_book_attributes_and_return_record = function()
{
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var search_string = "Soumya";
   var records = catalog.default_search(search_string);
   assert.equal(0,records.length);

};

test._14_search_by_string_under_specific_attribute_give_error_for_empty_file = function(){
   mocks.data = "";
   var search_string = "Ezio";
   var field = "author";
   assert.equal("No Such Records.",catalog.specific_search(search_string,field))
};

test._15_search_by_string_under_author_attribute_and_return_record = function(){
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var input = {searchString:"Ezio",author:true};
   var records = catalog.specific_search(input);
   assert.equal(1,records.length);
};

test._16_search_by_string_under_title_attribute_and_return_record = function(){
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var input = {searchString:"PrinceOfPersia",title:true};
   var records = catalog.specific_search(input);
   assert.equal(1,hash["1"].isbn);
};

test._17_search_by_string_under_publisher_attribute_and_return_record = function(){
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var input = {searchString:"Activision",publisher:true};
   var records = catalog.specific_search(input);
   assert.equal(23,hash["23"].isbn);
};

test._18_search_by_string_under_isbn_attribute_and_return_record = function(){
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var input = {searchString:"123",isbn:true};
   var records = catalog.specific_search(input);
   assert.equal(1234,hash["123"].price);
};

test._19_search_by_string_under_isbn_should_return_empty_array_if_isbn_not_exists = function(){
    var hash = {"1":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
   "123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var input = {searchString:"123456",isbn:true};
   var records = catalog.specific_search(input);
   assert.deepEqual([],records);
};

test._update_record_should_return_error_message_if_inventory_is_empty = function()
{
  mocks.data = "";
  var expected = "No records to update";
  var input_data = "isbn:0007258917;price:275;publisher:Harper Collins";
  assert.equal(expected,catalog.updateRecord(input_data));
};

test.update_record_should_update_record_if_isbn_exists = function(){
    var hash = {"0007258917":{isbn:"1",price:"123",title:"PrinceOfPersia",author:"Prince",publisher:"Ubisoft"},
   "23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
   };
   mocks.data = JSON.stringify(hash);
   var input_data = "isbn:0007258917;price:275;publisher:Harper Collins";
   catalog.updateRecord(input_data);
   var record = JSON.parse(mocks.data);
         
   assert.equal("275",record["0007258917"].price);
};

test.add_tags_should_give_error_msg_for_wrong_isbn = function(){
  var hash = {"1234":{isbn:"1234",price:"500",author:"Soumya",title:"C",publisher:"pearson"}}
  var input="isbn:123456;tags:novel";
  mocks.data = JSON.stringify(hash);
  assert.equal("isbn is not match",catalog.add_tags(input));
};
test.add_tags_should_add_tag_for_proper_isbn = function(){
  var hash = {"1234":{isbn:"1234",price:"500",author:"Soumya",title:"C",publisher:"pearson",tags:[]}}
  var input="isbn:1234;tags:novel,novel";
   mocks.data = JSON.stringify(hash);
  assert.equal("1234 added",catalog.add_tags(input));
};

test.search_tag_should_search_string_under_tags_and_return_record = function()
{
  var hash = {"1234":{isbn:"1234",price:"500",author:"Soumya",title:"C",publisher:"pearson",tags:['romantic']},
  "12356":{isbn:"123456",price:"700",author:"aniket",title:"alchemist",publisher:"lahiri",tags:['novel']}};
  mocks.data = JSON.stringify(hash);

  var input = {searchString:"novel",is_tag:true};
  var returned_record = catalog.specific_search(input);
  assert.equal('aniket',returned_record[0].author);
};

test._remove_tag_based_on_isbn_and_tag = function()
{
  var hash = {"1234":{isbn:"1234",price:"500",author:"Soumya",title:"C",publisher:"pearson",tags:['romantic']},
  "12356":{isbn:"123456",price:"700",author:"aniket",title:"alchemist",publisher:"lahiri",tags:['novel']}};
  mocks.data = JSON.stringify(hash);
  var input = "isbn:1234;tags:tragedy,comic";
  catalog.remove_tags(input);
  var records = JSON.parse(mocks.data);
  assert.equal('',records["1234"].tags);
};

test._20_bookcatalog_should_recognize_add_as_command_and_read_the_string = function()
{
  var expected = {add:true,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:'isbn:123;price:345',
                  search:false,
                  searchString:null,
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

  var input = ['add','isbn:123;price:345'];                
  assert.deepEqual(expected,catalog.getUserInput(input)); 
}

test._21_bookcatalog_should_recognize_list_as_command = function()
{
  var expected = {add:false,
                  list:true,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:null,
                  search:false,
                  searchString:null,
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

  var input = ['list'];                
  assert.deepEqual(expected,catalog.getUserInput(input)); 
};

test._22_bookcatalog_should_recognize_remove_as_command_and_isbn_as_value = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:true,
                  isbn:'1234',
                  remove:true,
                  book_info:null,
                  search:false,
                  searchString:null,
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

  var input = ['remove','-isbn','1234'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._23_bookcatalog_should_recognize_search_as_command__and_string_as_search_key = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:null,
                  search:true,
                  searchString:"Prince",
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

  var input = ['search','Prince'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._24_bookcatalog_should_recognize_search_and_isbn_as_command_field_as_value_string_as_key = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:true,
                  isbn:null,
                  remove:false,
                  book_info:null,
                  search:true,
                  searchString:"Prince",
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

   var input = ['search','-isbn','Prince'];
   assert.deepEqual(expected,catalog.getUserInput(input));
};

test._25_bookcatalog_should_recognize_search_and_as_command_field_as_value_string_as_key = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:null,
                  search:true,
                  searchString:"Soumya",
                  title:true,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

  var input = ['search','title','Soumya'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._25_bookcatalog_should_recognize_search_and_as_command_field_as_value_string_as_key = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:null,
                  search:true,
                  searchString:"Soumya",
                  title:false,
                  author:false,
                  publisher:true,
                  update:false,
                  tags:false,
                  is_tag:false
                  };

  var input = ['search','-publisher','Soumya'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._26_bookcatalog_should_recognize_update_as_command_field_as_value_string_as_key = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:'abcd',
                  search:false,
                  searchString:null,
                  title:false,
                  author:false,
                  publisher:false,
                  update:true,
                  tags:false,
                  is_tag:false
                  };

  var input = ['update','abcd'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._bookcatalog_should_recognize_add_and_tags_as_command = function(){
  var expected = {add:true,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:'Ghosh',
                  search:false,
                  searchString:null,
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:true,
                  is_tag:false
                  };

  var input = ['tags','add','Ghosh'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._bookcatalog_should_recognize_search_and_is_tag_as_command = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:false,
                  book_info:null,
                  search:true,
                  searchString:'tragedy',
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:true
                  };

  var input = ['search','-tag','tragedy'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

test._bookcatalog_should_recognize_remove_tag_as_command_and_take_string = function(){
  var expected = {add:false,
                  list:false,
                  is_isbn:false,
                  isbn:null,
                  remove:true,
                  book_info:'tragedy',
                  search:false,
                  searchString:null,
                  title:false,
                  author:false,
                  publisher:false,
                  update:false,
                  tags:false,
                  is_tag:true
                  };

  var input = ['remove','-tag','tragedy'];
  assert.deepEqual(expected,catalog.getUserInput(input));
};

exports.test = test;
