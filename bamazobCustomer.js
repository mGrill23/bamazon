require('dotenv').config();
var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MY_SQL_PASSWORD,
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department + " | " + res[i].price + " | " + res[i].stock);
        }
        console.log("-----------------------------------");

        run();
    });

    

    
}

function run() {
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "What is the id of the product you wish to buy?"
        },
        {
            name: "amount",
            type: "input",
            message: "How many do you wish to buy?"
        }
    ]).then(function(answer) {
        var ammount = connection.query("SELECT stock FROM products WHERE ?", {id: parseInt(answer.product)});
        if (ammount > parseInt(answer.amount)) {
            console.log("That is too many.");
            start();
        } else if(ammount === 0){
            console.log("We are currently out of that product.");
            start();
        }
        
        else {
            connection.query("UPDATE products SET stock = ? WHERE id = ?",[
                ammount - parseInt(answer.amount),
                answer.product
            ]);
            console.log("Your purchase was successful.");
            start();
        }
        
    });
}