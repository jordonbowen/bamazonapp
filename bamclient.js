var inquirer = require("inquirer");
var mysql = require("mysql");



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
});


connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    
    console.log("Item # | Product -- Department -- Price -- Quantity ");

    
    for (var i=0; i<res.length; i++){
    	if (i<9){
    		console.log(" " + res[i].Item_ID + "     | " + res[i].Product_Name + " -- " + res[i].Department_Name + "--" + res[i].Price + "--" + res[i].Stock_Quantity);
    	}
    	else if (i >= 9){
    		console.log(res[i].Item_ID + "     | " + res[i].Product_Name + " -- " + res[i].Department_Name + "--" + res[i].Price + "--" + res[i].Stock_Quantity);
    	}
    }

    promptUser();
});

var promptUser = function(){

   
	inquirer.prompt([{
		name: "Item_ID",
		message: "Like what you see? Enter the ID of what you would like to puchase.",

       
		validate: function(value){
            if (isNaN(value) == false) {
                return true;
            }
            else {
            	return false;
            }
		}
	},{

        
        name: "userQuantity",
        message: "Amazing! How any would you like?",

        
        validate: function(value){
            if (isNaN(value) == false) {
                return true;
            }
            else {
                return false;
            }
        }
        
    }]).then(function(answers){

          
    		var currentItem = answers.Item_ID;
    		var currentAmount = answers.userQuantity;

            connection.query('SELECT * FROM products WHERE ?',{
                Item_ID: answers.Item_ID
            },function(err, res){

               
                if (currentAmount > res[0].Stock_Quantity){
                    console.log("Thats too many! Try a smaller amount.");

                   
                    promptUser();
                }
               
                else { 
                    console.log("You can buy it!");

                 
                    var newQuantity = (res[0].Stock_Quantity - currentAmount);
                    var totalCost = res[0].Price*currentAmount;

                   
                    connection.query('UPDATE products SET ? WHERE ?',[{
                        Stock_Quantity: newQuantity
                    },{
                        Item_ID: currentItem
                    }], function(err, res){
                        console.log("You were charged $" + totalCost);

                        
                        promptUser();
                    });
                }
            })
	   })
} 