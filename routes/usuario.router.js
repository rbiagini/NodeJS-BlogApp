const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

const emailvalidator = require("email-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/registro", (req, res) => {
    res.render("usuarios/registro");
});

router.post("/registro", (req, res) => {
    error = [];

    if (
        !req.body.nome ||
        typeof req.body.nome == undefined ||
        req.body.nome == null
    ) {
        error.push({ texto: "O Nome não pode estar vazio" });
    }

    if (
        !req.body.email ||
        typeof req.body.email == undefined ||
        req.body.email == null
    ) {
        error.push({ texto: "Email não pode estar vazio" });
    }

    if (!emailvalidator.validate(req.body.email)) {
        error.push({ texto: "Formato de e-mail inválido" });
    }

    if (
        !req.body.senha ||
        typeof req.body.senha == undefined ||
        req.body.senha == null
    ) {
        error.push({ texto: "Digite uma senha" });
    }

    if (
        !req.body.senha2 ||
        typeof req.body.senha2 == undefined ||
        req.body.senha2 == null
    ) {
        error.push({ texto: "Digite a repetição da senha" });
    }

    if (req.body.senha != req.body.senha2) {
        error.push({ texto: "As senhas devem ser iguais" });
    }
    if (error.length > 0) {
        req.flash("error_msg", error);
        res.render("usuarios/registro", { body: req.body, erros: error });
    } else {
        Usuario.findOne({ email: req.body.email })
            .then((usuario) => {
                if (usuario) {
                    //req.flash("error_msg", "Esse e-mail já está cadastrado");
                    error.push({ texto: "Esse e-mail já está cadastrado" });
                    res.render("usuarios/registro", {
                        body: req.body,
                        erros: error,
                    });
                } else {
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                    });

                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(novoUsuario.senha, salt, (error, hash) => {
                            if (error) {
                                req.flash(
                                    "error_msg",
                                    "Houve um erro para salvar o usuário"
                                );
                                res.redirect("/");
                                console.log("erro 1");
                            }

                            novoUsuario.senha = hash;

                            novoUsuario
                                .save()
                                .then(() => {
                                    req.flash(
                                        "success_msg",
                                        "Usuário criado com sucesso!"
                                    );
                                    res.redirect("/");
                                })
                                .catch((error) => {
                                    req.flash(
                                        "error_msg",
                                        "Houve um erro ao criar o usuário"
                                    );
                                    res.redirect("/usuarios/registro");
                                });
                        });
                    });
                }
            })
            .catch((error) => {
                req.flash("error_msg", "Erro no acesso aos usuários");
                res.redirect("/");
            });
        /*    
        const usuario = {
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            senha2: req.body.senha2,
        };
        res.send(usuario);
        //res.render("usuarios/registro");
        */
    }
});

router.get("/login", (req, res) => {
    res.render("usuarios/login");
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true,
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "Usuário desconectado com sucesso");
        res.redirect("/");
    });
});

module.exports = router;
