import { Router } from "express";
import passport from "passport";
import { registerUser, failRegister, loginUser, failLogin, restorePassword, failRestore, logoutUser, githubCallback } from "../controllers/session.controller.js";

const router = Router();

router.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), registerUser);
router.get("/failregister", failRegister);

router.post("/login", passport.authenticate("login", { session: false, failureRedirect: "/faillogin" }), loginUser);
router.get("/faillogin", failLogin);

router.post("/restore", passport.authenticate("restore", { failureRedirect: "/failrestore" }), restorePassword);
router.get("/failrestore", failRestore);

router.get("/logout", logoutUser);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

export default router;
