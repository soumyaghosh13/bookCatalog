var catalog = {};
catalog.fs = require('fs');


catalog.read_records_from_file = function()
{
	var existing_records = catalog.fs.readFileSync('inventory.txt','utf-8');
	return JSON.parse(existing_records);
};

catalog.stringToObj = function(text)
{
	var arrayOfRecord = text.split(';');
	var result = {isbn:'',price:'',author:'',title:'',publisher:'',tags:[]};
	arrayOfRecord.forEach(function(element){
		key=element.split(':');
		if(key[0]=='isbn')	result.isbn=key[1];
		if(key[0]=='price') result.price=key[1];
		if(key[0]=='author') result.author=key[1];
		if(key[0]=='title') result.title=key[1];
		if(key[0]=='publisher') result.publisher=key[1];
		if(key[0]=='tags')result.tags=key[1].split(',');
	});
	
	return result;
};
var reduce_duplicacy=function(data){
	return data.filter(function(elem,pos){
		return data.indexOf(elem)==pos;});
}
catalog.add_tags=function(input){
	var isbn_with_tag=catalog.stringToObj(input);
	var inventory=catalog.read_records_from_file();
	var allKeys=Object.keys(inventory);
	if(allKeys.indexOf(isbn_with_tag.isbn)==-1){
		return "isbn is not match";
	}
	var singleBook = inventory[isbn_with_tag.isbn];
	singleBook.tags=isbn_with_tag.tags.concat(isbn_with_tag.tags);
	singleBook.tags=reduce_duplicacy(singleBook.tags);
	inventory[isbn_with_tag.isbn]=singleBook;
	catalog.fs.writeFileSync('inventory.txt',JSON.stringify(inventory));
	return isbn_with_tag.isbn+" added";

};
catalog.remove_tags = function(data){
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0)
	 	return "No Records in inventory";

	var isbn = catalog.get_isbn(data);
	if(!catalog.check_isbn(isbn))
		return "Given ISBN doesnot Exist";

	var existing_records_hash = catalog.read_records_from_file();
	existing_records_hash[isbn].tags[0] = '';
	catalog.fs.writeFileSync('inventory.txt',JSON.stringify(existing_records_hash));
	return "tag removed";
};

catalog.stringToHash = function(text){
	var result = catalog.stringToObj(text);
	var catalog_hash = {};
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0){
		catalog_hash[result.isbn] = result;
			return catalog_hash;
	}

	var existing_records_hash = catalog.read_records_from_file()
	existing_records_hash[result.isbn] = result;
		return existing_records_hash;
};
catalog.get_isbn = function(data)
{
	var arrayOfRecord = data.split(';');
	var isbn;
	arrayOfRecord.forEach(function(element){
		key=element.split(':');
		if(key[0]=='isbn')	isbn=key[1];
	});	
	return isbn;
}
catalog.check_isbn = function(isbn)
{
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0)
		return false;
	var existing_records_hash = catalog.read_records_from_file();
	var record_keys = Object.keys(existing_records_hash);
	for(var index = 0; index<record_keys.length; index++)
	{
		if(isbn==record_keys[index])
			return true;
	}
	return false;
}
catalog.add_record = function(data)
{
	var isbn = catalog.get_isbn(data);
	var is_isbn = catalog.check_isbn(isbn);
	if(is_isbn) return "record with same isbn exists";

	var catalog_hash = catalog.stringToHash(data);
	var catalog_string_hash = JSON.stringify(catalog_hash);
	catalog.fs.writeFileSync('inventory.txt',catalog_string_hash);
	return "record added";
};
catalog.list_record = function(){
		var inventory_hash = catalog.read_records_from_file();
		var keys = Object.keys(inventory_hash);
		var inventory_arr = [];
		for(var index = 0; index < keys.length; index++){
			inventory_arr.push(inventory_hash[keys[index]]);
		}
		return inventory_arr;
};
catalog.remove_record = function(isbn){
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0 || 
		catalog.fs.readFileSync('inventory.txt','utf-8').length == 2)
			return "there are no records to remove";
	var existing_records_hash = catalog.read_records_from_file();
	delete existing_records_hash[isbn];
	var updateRecord = JSON.stringify(existing_records_hash);
	catalog.fs.writeFileSync('inventory.txt',updateRecord);
	return "record deleted";
};

catalog.default_search = function(searchString)
{
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0)
	 return "no records to search";
	var hash = catalog.read_records_from_file();
	var keys = Object.keys(hash);
	var arrayOfRecord = [];
	for(index = 0; index < keys.length ; index++){
		if(hash[keys[index]]["isbn"].indexOf(searchString)!=-1 ||
			hash[keys[index]]["author"].indexOf(searchString)!=-1 ||
			hash[keys[index]]["price"].indexOf(searchString)!=-1 ||
			hash[keys[index]]["title"].indexOf(searchString)!=-1 ||
			hash[keys[index]]["publisher"].indexOf(searchString)!=-1)
				arrayOfRecord.push(hash[keys[index]]);
	}
	return arrayOfRecord;
};

catalog.specific_search = function(input){
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0)
	 	return "No Such Records.";

	var hash = catalog.read_records_from_file();
	var arrayOfRecord = [];
	var field;
	var keys = Object.keys(hash);

	var search_by_attribute = function(field)
	{
		for(index = 0; index < keys.length ; index++){
			if(hash[keys[index]][field].indexOf(input.searchString)!=-1)
				arrayOfRecord.push(hash[keys[index]])
		}
		return arrayOfRecord;
	}

	var search_by_tag = function(field)
	{
		for(index = 0; index < keys.length ; index++){
			if(hash[keys[index]][field][0].indexOf(input.searchString)!=-1)
				arrayOfRecord.push(hash[keys[index]])
		}
		return arrayOfRecord;
	}

	if(input.author){ 
		field = "author";
		return search_by_attribute(field);
	}
	if(input.title){
		field="title";
		return search_by_attribute(field);
	}
	if(input.publisher){
		field="publisher";
		return search_by_attribute(field);
	}
	if(input.isbn){
		field="isbn";
		return search_by_attribute(field);
	}
	if(input.is_tag){
		field = "tags";
		return search_by_tag(field);
	}
};


catalog.updateRecord = function(data)
{
	if(catalog.fs.readFileSync('inventory.txt','utf-8').length == 0)
		return "No records to update";
	var isbn = catalog.get_isbn(data);
	var check_isbn = catalog.check_isbn(isbn);
	if(!check_isbn) 
		return "Provided isbn doesnot exists";
	var existing_records_hash = catalog.read_records_from_file();
	var input_obj = catalog.stringToObj(data);

	var attributes = ['price','title','author','publisher'];
	var update_record = function(element)
	{
		if(input_obj[element])
		existing_records_hash[input_obj.isbn][element] = input_obj[element];
	}
	attributes.forEach(update_record);
	var updateRecord = JSON.stringify(existing_records_hash);
	catalog.fs.writeFileSync('inventory.txt',updateRecord);
	return "record updated";
};


var is_add = function(element){
		return element == 'add';
};
var is_list = function(element){
	return element == 'list';
};
var is_remove = function(element){
	return element == 'remove';
};
var is_isbn = function(element){
	return element == '-isbn';
};
var is_title = function(element){
	return element == '-title';
};
var is_publisher = function(element){
	return element == '-publisher';
};
var is_author = function(element){
	return element == '-author';
};

var is_tag = function(element){
	return element == '-tag';
};
var is_search = function(element){
		return element == 'search';
};
var is_update = function(element){
		return element == 'update';
 };
var is_tags = function(element){
		return element == 'tags';
};

catalog.getUserInput = function(args)
{
	var result = { 	add:false,
					list:false,
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
	result.add = args.some(is_add);
	result.list = args.some(is_list);
	result.remove = args.some(is_remove);
	result.is_isbn = args.some(is_isbn);
	result.search = args.some(is_search);
	result.title = args.some(is_title);
	result.publisher = args.some(is_publisher);
	result.author = args.some(is_author);
	result.update = args.some(is_update);
	result.is_tag = args.some(is_tag);
	result.tags = args.some(is_tags);


	if((result.add && result.tags) || (result.remove && result.is_tag))
	{
		result.book_info = args[2];
			return result;
	}

	if(result.add || result.update)
		result.book_info = args[1];

	if(result.remove && result.is_isbn)
			result.isbn = args[2];
	if(result.search && result.is_isbn || result.title || result.publisher
		|| result.author || result.is_tag){
			result.searchString = args[2];
				return result;
		}
	if(result.search)
			result.searchString = args[1];
	return result;	
};

catalog.display_list = function(arrayOfRecord){
	console.log("ISBN       Price     Author     Title     Publisher   Tags");
	for(index=0;index<arrayOfRecord.length;index++){
	console.log(arrayOfRecord[index].isbn+"  "+
		arrayOfRecord[index].price+"  "+
		arrayOfRecord[index].author+"  "+
		arrayOfRecord[index].title+"  "+arrayOfRecord[index].publisher+" "+
		arrayOfRecord[index].tags);
	}
};
catalog.manageUserInput = function(input){

	if(input.add && input.tags)
	{
		console.log(catalog.add_tags(input.book_info));
		return;
	}

	if(input.add)
		console.log(catalog.add_record(input.book_info));

	if(input.list){
		var arrayOfRecord =  catalog.list_record(input);
		catalog.display_list(arrayOfRecord);
	}
	if(input.remove && input.is_tag)
	{
		console.log(catalog.remove_tags(input.book_info));
		return;
	}


	if(input.remove)
	 	console.log(catalog.remove_record(input.isbn));


	if(input.search && input.title || input.publisher || input.author ||
		input.is_tag){	
			catalog.display_list(catalog.specific_search(input));
				return;
		}

	if(input.update)
		console.log(catalog.updateRecord(input.book_info));	

	if(input.search){
		if(catalog.default_search(input.searchString).length < 1){
			console.log("No Record Found");
				return;
		}
		catalog.display_list(catalog.default_search(input.searchString));
	}
};

exports.catalog = catalog;
