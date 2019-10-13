const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const port = process.env.PORT || 3000;
const app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    console.log(firstName + " : " + lastName + " :" + email);

    var baseUrl = "https://us20.api.mailchimp.com/3.0/lists/0b332bd37f";
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                "FNAME": firstName,
                "LNAME": lastName
            }
        }]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url: baseUrl,
        method: "POST",
        headers: {
            "Authorization": "michael1 a9be6eaa39237349dc4369779c1937ef-us20"
        },
        body: jsonData
    }
    request(options, (error, response, body) => {
        if (error) {
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        } else {
            console.log(response.statusCode);
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }


        }

    });

});



app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(port, () =>
    console.log("server is running on port : " + port)
);

// a9be6eaa39237349dc4369779c1937ef-us20 - api key
//0b332bd37f - list id 