var hash = {"1":{isbn:"Princ",price:"123",title:"PrinceOfPersia",author:"Prince++",publisher:"Ubisoft"},
"12345":{isbn:"12",price:"12",title:"SpinterCell",author:"samFisher",publisher:"Ubisoft"},
"123":{isbn:"123",price:"1234",title:"AssassinsCreed",author:"Ezio",publisher:"Ubisoft"},
"23":{isbn:"23",price:"234",title:"Prince",author:"Ghosht",publisher:"Activision"}
};
//console.log(hash);
console.log("--------------------------------------->");
// "1237x":{isbn:"1237x",price:"400",author:"bala"}};
// console.log(hash);
// console.log(hash["1234"]["isbn"]);
// console.log(hash["1234"]["price"]);
// console.log(hash["1234"].author);
// hash["3456"] = {isbn:"345",price:"299",author:"bala"};
// console.log(hash["1234"].isbn,hash["1234"].price,hash["1234"].author);
// var keys = Object.keys(hash);
// console.log(keys);
// for(var i = 0; i<keys.length;i++)
// {
//  console.log(hash[keys[i]].isbn,hash[keys[i]].price,hash[keys[i]].author);
// };
// console.log(hash);
// delete hash["1234"];
// console.log(hash);
var keys = Object.keys(hash);
console.log(keys);
console.log("------------------------------------->");
var obj = [];

var searchString = "Prince".toLowerCase();

for(var i = 0; i < keys.length; i++){
	if(hash[keys[i]]["author"].indexOf(searchString)!=-1 ||
		hash[keys[i]]["price"].indexOf(searchString)!=-1 ||
		hash[keys[i]]["title"].indexOf(searchString)!=-1 ||
		hash[keys[i]]["publisher"] == "publisher"){
	console.log(hash[keys[i]]);
	obj.push(hash[keys[i]]);
	}
}

attributes.forEach(performSearch);
console.log(obj);
console.log('---------------->')
for(i=0;i<obj.length;i++){
console.log(obj[i].isbn+" "+obj[i].author+" "+obj[i].title+" "+obj[i].publisher);
}