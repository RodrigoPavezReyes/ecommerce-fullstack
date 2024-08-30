import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt"
import passport from "passport";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


// Crear __dirname manualmente
const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta del archivo actual
const __dirname = dirname(__filename); // Obtiene el directorio del archivo actual

//CUSTOM PASSPORT
const passportCall = (strategy) =>{
    return async(req,res,next) =>{
        passport.authenticate(strategy, function(err, user,info){
            if (err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()});
            }
            req.user = user
            next()
        })(req,res,next)
    }
}

//MIDDLEWARS DE AUTORIZACION
const authorization = (role) =>{
    return async(req,res,next)=>{
        if(!req.user) return res.status(401).send({error:"No Autorizado"})
        if(req.user.role!=role)return res.status(403).send({error:"No tiene permisos"})
        next();
    }
}




export {createHash, isValidPassword, __dirname, passportCall, authorization}

