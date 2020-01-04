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

//global variables to work with api calls

const init = async() => {
    
    let profile_image = null;
    let profile_name = null;
    let profile_link = null;
    let bio = null;
    let following = null;
    let followers = null;
    let stars = null;
    let public_repos = null;
    let blog = null;

    try{
        const data = await inquire();
        const queryURL = `https://api.github.com/users/${data.username}`;

        //github api call to develop profile
        axios
            .get(queryURL)
            .then(function(res){
                
                //get profile information minus stars
                const info = res.data;
                profile_image = info.avatar_url;
                profile_name = info.name;
                profile_link = info.html_url;
                bio = info.bio;
                public_repos = info.public_repos;
                blog = info.blog;

                //get github stars
                axios
                    .get(queryURL + "/repos")
                    .then(function(res){
                        res.data.forEach(function(el){
                            stars += el.stargazers_count
                        });
                        console.log(stars);
                    });
               
            });
    }
    catch(error){
        console.log(error);
    }

    console.log("Success! This worked!");
}
init()
