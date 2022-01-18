const app = require("./app.js");

app.listen(9090, (error) => {
    if (error) console.log(error);
    else console.log("server is listening");
});
