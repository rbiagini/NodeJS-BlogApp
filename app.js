const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const connectToDatabase = require("./connectDb");

const session = require("express-session");
//const { CyclicSessionStore } = require("@cyclic.sh/session-store");
const flash = require("connect-flash");

const { default: mongoose } = require("mongoose");
//const mongoose = require("mongoose");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");

const passport = require("passport");
require("./config/auth")(passport);

connectToDatabase();

if (1 == 0 && process.env.NODE_ENV == "production") {
    /*
    const cyclic_option = {
        table: {
            name: process.env.CYCLIC_DB,
        },
    };
    console.log("CYCLIC_DB: " + process.env.CYCLIC_DB);

    app.use(
        session({
            //store: new CyclicSessionStore(cyclic_option),
            secret: "cursodeNode",
            resave: true,
            saveUninitialized: true,
        })
    );
    */
} else {
    app.use(
        session({
            secret: "cursodeNode",
            resave: true,
            saveUninitialized: true,
        })
    );
}

// tem que ser depois da declaração da sessão e antes do flash
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); //deve ser colocado depois da config de session

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

app.engine(
    "handlebars",
    handlebars.engine({
        defaultLayout: "main",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: require("./config/handlebars-helpers"),
    })
);

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

const md = function (req, res, next) {
    console.log("midware rodou!");
    next();
};
app.use(md);

app.get("/teste", (req, res) => {
    console.log("começou o teste");
    Postagem.find()
        .then((postagens) => {
            console.log("Postagens: " + postagens.length);
        })
        .catch((err) => {
            console.log("Erro encontrado 001");
        });
    res.send("Está rodando");
});
//Rotas
app.get("/", (req, res) => {
    console.log("inicio do index");
    Postagem.find()
        .populate("categoria")
        .sort({ data: "desc" })
        .then((postagens) => {
            //req.flash("success_msg", "Erro ao carregar os posts");
            console.log("Renderizando a /index");
            res.render("index", {
                postagens: postagens,
                node_env: process.env.NODE_ENV,
            });
        })
        .catch((error) => {
            console.log("Erro na /index");
            req.flash("error_msg", "Erro ao carregar os posts");
            res.redirect("/404");
        });
});

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug })
        .then((postagem) => {
            if (postagem) {
                res.render("postagem/index", { postagem: postagem });
            } else {
                req.flash("error_msg", "Essa postagem não existe");
                res.redirect("/");
            }
        })
        .catch((error) => {
            req.flash("error_msg", "Houve um erro interno!");
            res.redirect("/");
        });
});

app.get("/categorias", (req, res) => {
    Categoria.find()
        .then((categorias) => {
            res.render("./categorias/index", { categorias: categorias });
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao listar as categorias");
            res.redirect("/");
        });
});

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug })
        .then((categoria) => {
            if (categoria) {
                Postagem.find({ categoria: categoria._id })
                    .sort({ data: "desc" })
                    .then((postagens) => {
                        res.render("categorias/postagens", {
                            postagens: postagens,
                            categoria: categoria,
                        });
                    })
                    .catch((error) => {
                        req.flash(
                            "error_msg",
                            "Não foi possível carregar as postagens."
                        );
                        res.redirect("/");
                    });
            } else {
                req.flash("error_msg", "Essa categoria não foi encontrada");
                res.redirect("/");
            }
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao procurar a categoria");
            res.redirect("/");
        });
});

app.get("/404", (req, res) => {
    res.send("Houve um erro");
});
const admin = require("./routes/admin");
//const { route } = require("./routes/admin");
const usuario = require("./routes/usuario.router");
//const { route } = require("./routes/usuario");

const { text } = require("body-parser");

app.use("/admin", admin);
app.use("/usuarios", usuario);

const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log("Servidor rodando na porta " + port);
});
