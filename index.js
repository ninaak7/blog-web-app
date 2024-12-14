import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("validation/login");
});

app.get("/register", (req, res) => {
    res.render("validation/register");
});

app.post("/submit_register", (req, res) => {
    const username = req.body["name"];
    res.render("index", {name:username});
});

app.post("/submit_login", (req, res) => {
    res.render("index");
});

app.get("/logout", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
