// controllers/session.controller.js
import User from "../model/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    res.redirect("/login");
};

export const failRegister = async (req, res) => {
    console.log("Registro fallido");
    res.send({ error: "Failed" });
};

export const loginUser = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Credenciales Invalidas" });
    }

    const token = req.authInfo?.token;
    if (!token) {
        return res.status(500).send({ status: "error", error: "Token no generado" });
    }

    res.cookie("coderCookieToken", token, {
        maxAge: 60 * 60 * 1000, // 1 hora
        httpOnly: true
    });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role
    };

    res.redirect("/products");
};

export const failLogin = (req, res) => {
    res.send({ error: "Error de Login" });
};

export const restorePassword = async (req, res) => {
    res.redirect("/login");
};

export const failRestore = async (req, res) => {
    console.log("Restablecimiento fallido");
    res.send({ error: "Failed restore" });
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error al cerrar sesión");
        }
        res.redirect("/login");
    });
};

export const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
};
