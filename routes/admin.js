const express = require("express");

const mongoose = require("mongoose");
require("../models/Categoria");
require("../models/Postagem");

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");

const router = express.Router();

const session = require("express-session");
const flash = require("connect-flash");

const { eAdmin } = require("../config/eAdmin");

router.get("/", eAdmin, (req, res) => {
    //res.send("página de posts");
    res.render("admin/index");
});

router.get("/posts", eAdmin, (req, res) => {
    res.send("página de posts");
});

router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find()
        .sort({ date: "desc" })
        .then((categorias) => {
            res.render("admin/categorias", { categorias: categorias });
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin");
        });
});

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id })
        .then((categoria) => {
            res.render("admin/editcategorias", { categoria: categoria });
        })
        .catch((error) => {
            req.flash("error_msg", "Essa categoria não exste");
            res.redirect("/admin/categorias");
        });
});

router.post("/categorias/edit", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.body.id })
        .then((categoria) => {
            console.log(categoria);
            console.log(req.body);
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;

            categoria
                .save()
                .then(() => {
                    req.flash("success_msg", "Categoria editada com sucesso!");
                    res.redirect("/admin/categorias");
                })
                .catch((error) => {
                    req.flash(
                        "error_msg",
                        "Houve um erro interno ao salvar a edição da categoria"
                    );
                    res.redirect("/admin/categorias");
                });
        })
        .catch((error) => {
            req.flash(
                "error_msg",
                "Houve um erro ao editar a categoria. " + error
            );
            res.redirect("/admin/categorias");
        });
});

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.deleteOne({ _id: req.body.id })
        .then(() => {
            req.flash("success_msg", "Categoria deletada com sucesso");
            res.redirect("/admin/categorias");
        })
        .catch((error) => {
            req.flash("error_msg", "Houve um erro ao apagar a categoria");
            res.redirect("/admin/categorias");
        });
});

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias");
});

router.post("/categorias/add", eAdmin, (req, res) => {
    var erros = [];

    if (
        !req.body.nome ||
        typeof req.body.nome == undefined ||
        req.body.nome == null
    )
        erros.push({ texto: "Nome inválido" });

    if (
        !req.body.slug ||
        typeof req.body.slug == undefined ||
        req.body.slug == null
    )
        erros.push({ texto: "Slug inválido" });

    if (req.body.nome.length < 2) erros.push({ texto: "Nome muito pequeno" });

    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros, body: req.body });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug,
        };

        new Categoria(novaCategoria)
            .save()
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso");
                res.redirect("/admin/categorias");
            })
            .catch((err) => {
                req.flash("error_msg", "Houve um erro ao criar a categoria");
                res.redirect("/admin");
            });
        //res.render("admin/addcategorias", { salvo: true });
    }
});

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find()
        .populate("categoria")
        .sort({ data: "desc" })
        .then((postagens) => {
            res.render("admin/postagens", { postagens: postagens });
        })
        .catch((error) => {
            req.flash(
                "error_msg",
                "Houve um erro ao exibir a lista de postagens: " + error
            );
            res.redirect("/admin");
        });
    // res.render("admin/postagens");
});

function showPostagensAdd(req, res, erros, body) {
    Categoria.find()
        .then((categorias) => {
            //console.log(categorias);
            res.render("admin/addpostagem", {
                categorias: categorias,
                erros: erros,
                body: body,
            });
        })
        .catch((error) => {
            req.flash(
                "error_msg",
                "Houve um erro ao criar o formulário de postagem"
            );
            res.redirect("/admin");
        });
}

router.get("/postagens/add", eAdmin, (req, res) => {
    showPostagensAdd(req, res, "", "");
});

router.post("/postagens/add", eAdmin, (req, res) => {
    erros = [];

    if (req.body.categoria == "0")
        erros.push({ texto: "Nenhuma categoria selecionada." });

    if (
        !req.body.titulo ||
        typeof req.body.titulo == undefined ||
        req.body.titulo == null
    )
        erros.push({ texto: "Título inválido" });

    if (
        !req.body.slug ||
        typeof req.body.slug == undefined ||
        req.body.slug == null
    )
        erros.push({ texto: "Slug inválido" });

    if (
        !req.body.descricao ||
        typeof req.body.descricao == undefined ||
        req.body.descricao == null
    )
        erros.push({ texto: "Descrição inválida" });

    if (
        !req.body.conteudo ||
        typeof req.body.conteudo == undefined ||
        req.body.conteudo == null
    )
        erros.push({ texto: "Conteúdo inválido" });

    if (erros.length > 0) {
        showPostagensAdd(req, res, erros, req.body);
        //res.render("admin/addpostagem", { erros: erros, body: req.body });
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug,
        };

        new Postagem(novaPostagem)
            .save()
            .then(() => {
                req.flash("success_msg", "Postagem registrada com sucesso.");
                res.redirect("/admin/postagens");
            })
            .catch((error) => {
                req.flash(
                    "error_msg",
                    "Houve um erro ao registrar a Postagem."
                );
                res.redirect("/admin/postagens");
            });
    }
});

function showPostagemEdit(req, res, err) {
    Postagem.findOne({ _id: req.params.id })
        .then((postagem) => {
            Categoria.find()
                .then((categoria) => {
                    res.render("admin/editpostagens", {
                        postagem: postagem,
                        categoria: categoria,
                        erros: err,
                    });
                })
                .catch((error) => {
                    req.flash(
                        "error_msg",
                        "Houve um erro ao objer as categorias"
                    );
                    res.redirect("/admin/postagens");
                });
        })
        .catch((error) => {
            req.flash(
                "error_msg",
                "Houve um erro ao obter as postagens." + error
            );
            res.redirect("/admin/postagens");
        });
}

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    showPostagemEdit(req, res, null);
});

router.post("/postagens/edit/:id", eAdmin, (req, res) => {
    erros = [];

    if (req.body.categoria == "0")
        erros.push({ texto: "Nenhuma categoria selecionada." });

    if (
        !req.body.titulo ||
        typeof req.body.titulo == undefined ||
        req.body.titulo == null
    )
        erros.push({ texto: "Título inválido" });

    if (
        !req.body.slug ||
        typeof req.body.slug == undefined ||
        req.body.slug == null
    )
        erros.push({ texto: "Slug inválido" });

    if (
        !req.body.descricao ||
        typeof req.body.descricao == undefined ||
        req.body.descricao == null
    )
        erros.push({ texto: "Descrição inválida" });

    if (
        !req.body.conteudo ||
        typeof req.body.conteudo == undefined ||
        req.body.conteudo == null
    )
        erros.push({ texto: "Conteúdo inválido" });

    if (erros.length > 0) {
        showPostagemEdit(req, res, erros);
        //res.render("admin/addpostagem", { erros: erros, body: req.body });
    } else {
        Postagem.findOne({ _id: req.body.id })
            .then((postagem) => {
                postagem.titulo = req.body.titulo;
                postagem.categoria = req.body.categoria;
                postagem.slug = req.body.slug;
                postagem.descricao = req.body.descricao;
                postagem.conteudo = req.body.conteudo;

                postagem
                    .save()
                    .then(() => {
                        req.flash(
                            "success_msg",
                            "Postagem alterada com sucesso!"
                        );
                        res.redirect("/admin/postagens");
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao alterar a postagem!");
                        res.redirect("/admin/postagens");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "houve um erro ao salvar a postagem");
                res.redirect("/admin/postagens");
            });
    }
});

router.get("/postagens/delete/:id", eAdmin, (req, res) => {
    Postagem.remove({ _id: req.params.id })
        .then(() => {
            req.flash("success_msg", "Postagem apagada com sucesso");
            res.redirect("/admin/postagens");
        })
        .catch((error) => {
            req.flash("error_msg", "Houve um erro ao apagar a postagem");
            res.redirect("/admin/postagens");
        });
});

module.exports = router;
