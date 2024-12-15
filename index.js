import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

//const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/+/, '');
const postsFile = "C:\\Users\\ninak\\Desktop\\Blog Web App\\posts.json";

function readPosts() {
    const data = fs.readFileSync(postsFile);
    return JSON.parse(data);
}

function savePosts(posts) {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("validation/login");
});

app.get("/register", (req, res) => {
    res.render("validation/register");
});

app.post("/submit-register", (req, res) => {
    const username = req.body["name"];
    res.render("index", {name:username});
});

app.post("/submit-login", (req, res) => {
    res.render("index");
});

app.get("/logout", (req, res) => {
    const posts = readPosts();
    while(posts.length!==0){
        posts.pop();
    }
    savePosts(posts);
    if (!Array.isArray(posts)) {
        savePosts([]);
    }
    res.redirect("/");
});

app.get('/index', (req, res) => {
    const posts = readPosts();
    res.render('index', { posts });
});

app.get("/create-post", (req, res) => {
    res.render("create");
});

app.post("/submit-post", (req, res) => {
    const title = req.body["title"];
    const description = req.body["description"];
    const dateCreated = new Date().toLocaleString();
    const id = Date.now().toString();

    const newPost = {
        id,
        title,
        description,
        dateCreated
    };

    const posts = readPosts();
    posts.push(newPost);
    savePosts(posts);

    res.redirect("/index");
});

app.get("/edit-post/:id", (req, res) => {
    const postId = req.params.id;
    const posts = readPosts();

    const postToEdit = posts.find(post => post.id === postId.toString());

    if (!postToEdit) {
        return res.status(404).send("Post not found");
    }

    res.render('edit', { post: postToEdit });
});

app.post("/save-post/:id", (req, res) => {
    const postId = req.params.id;
    const updatedTitle = req.body["title"];
    const updatedDescription = req.body["description"];

    const posts = readPosts();
    const postIndex = posts.findIndex(post => post.id === postId.toString());

    posts[postIndex].title = updatedTitle;
    posts[postIndex].description = updatedDescription;

    savePosts(posts);

    res.redirect("/index");
});

app.get("/delete-post/:id", (req, res) => {
    const posts = readPosts();
    const postId = req.params.id;

    const updatedPosts = posts.filter(post => post.id !== postId);
    savePosts(updatedPosts);

    res.redirect("/index");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
