var bc = require('./bookcatalog_lib.js').catalog;
var fs = require('fs');
var main = function main () {
	var userInput=process.argv.slice(2,process.argv.length);
	var InputGiven = bc.getUserInput(userInput);
	bc.manageUserInput(InputGiven);
};
main();