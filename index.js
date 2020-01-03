const generate_html = require('./generateHTML');
const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');

const inquire = () => {
    return inquirer.prompt([{
        type: "input",
        name: "username",
        message: "What is your username on Github?"
    },
    {
        type: "list",
        name: "color",
        choices:["green", "blue", "pink", "red"],
        message: "Pick your favorite color from these options."

    
    }])
}

const init = async() => {
    try{
        const data = await inquire();
        const queryURL = `https://api.github.com/users/${data.username}`;

        axios
            .get(queryURL)
            .then(function(res){
                console.log(res);
            });
    }
    catch(error){
        console.log(error);
    }

    console.log("Success! This worked!");
}
init()
