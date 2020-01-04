const html = require('./generateHTML');
const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const util = require('util');

const asyncWriteFile = util.promisify(fs.writeFile);

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
    let location = null;

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
                location = info.location;
                followers = info.followers;
                following = info.following;
                let api_key = "AIzaSyCujY5-2G4cPCUDlnzVADfkFeclTUZ5GKc";

                //get github stars
                axios
                    .get(queryURL + "/repos")
                    .then(function(res){
                        res.data.forEach(function(el){
                            stars += el.stargazers_count
                        });

                        console.log(stars);
                        let html_page = html.generateHTML(data, profile_image, profile_name,location, profile_link, blog, bio, public_repos, followers, stars, following);
                        asyncWriteFile("index.html", html_page);
                    });
               
            });
    }
    catch(error){
        console.log(error);
    }

    console.log("Success! This worked!");
}
init()
