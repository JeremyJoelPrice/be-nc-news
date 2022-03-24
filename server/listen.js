const app = require("./app.js");

app.listen((process.env.PORT || 9090), (error) => {
    if (error) console.log(error);
    else console.log("server is listening");
});
