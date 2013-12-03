// var input = process.argv.slice(2,process.argv.length);
// var obj = {add:false};


// var isAdd = function(element){
// 	return element == 'add'
// }
// obj.add = input.some(isAdd);

// console.log(obj); 

var input = { 		add:true,
					list:false,
					is_isbn:false,
                  	isbn:null,
					remove:false,
					book_info:"isbn:0007258917;price:100"
	};


var manageOperation = function(input){
	var result = {};
	if(input.add)
		//add_record(input);
		console.log("Record Added Sucessfully");
	if(input.list == true)
		//list();
		console.log("Record Displayed Sucessfully");
	if(input.remove == true)
		//remove();
		console.log("Record Removed Sucessfully");

};
manageOperation(input);