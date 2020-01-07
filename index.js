const html = require('./generateHTML');
const fs = require('fs'),
    convertFactory = require('electron-html-to');
    
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});
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
        choices: ["green", "blue", "pink", "red"],
        message: "Pick your favorite color from these options."
    }])
}

//global variables to work with api calls
const init = async () => {
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

    try {
        const data = await inquire();
        const queryURL = `https://api.github.com/users/${data.username}`;

        //github api call to develop profile
        axios
            .get(queryURL)
            .then(function (res) {

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
                const api_key = "AIzaSyCujY5-2G4cPCUDlnzVADfkFeclTUZ5GKc";

                //get github stars
                axios
                    .get(queryURL + "/repos")
                    .then(function (res) {
                        res.data.forEach(function (el) {
                            stars += el.stargazers_count
                        });
                        const google_maps = `https://maps.googleapis.com/maps/api/staticmap?center=${location}&size=600x600&key=${api_key}`;

                        let html_page = html.generateHTML(data, profile_image, profile_name, google_maps, location, profile_link, blog, bio, public_repos, followers, stars, following);
                        
                        //write the generated html to an index file to later be converted into a pdf
                        asyncWriteFile("index.html", html_page);

                        //convert the index.html into profile.pdf with electron-html-to node package
                        conversion({file: "index.html", html: html_page}, function (err, result) {
                            if (err) {
                                return console.error(err);
                            }

                            result.stream.pipe(fs.createWriteStream('profile.pdf'));
                            conversion.kill(); 
                        });
                    });

            });
    }
    catch (error) {
        console.log(error);
    }
}
init()
