import passport from "passport";
import local from "passport-local"
import User from "../model/user.model.js"
import { createHash,isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2"
import jwt from "passport-jwt"
import jsonwebtoken from "jsonwebtoken"



const LocalStrategy = local.Strategy

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = req =>{
    let token = null;
    if ( req && req.cookies){ 
        token = req.cookies["coderCookieToken"]
    }
    return token
}

const initializePassport =()=>{ 

///ESTRATEGIA DE JWT
passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey:"coderSecret", //verificar que sea el mismo secret en app.js
}, async(jwt_payload,done)=>{
    try {
        return done(null, jwt_payload);
    } catch (error) {
        return done(error)
    }
}))

//ESTRATEGIA LOGIN

passport.use("login", new LocalStrategy({usernameField:"email"},async(email,password,done)=>{
    try {
        //busco usuario en la base de datos
        const user = await User.findOne({email})
        if(!user){
            console.log("Usuario no existe")
            return done(null,false,{message:"Usuario no existe"})
        }

        //verifico que la contraseña sea correcta
        if(!isValidPassword(user,password)) return done(null,false,{message:"Password incorrecto"})
        
        
        //genero token JWT
        let token = jsonwebtoken.sign({ email: user.email, userId: user._id, role: user.role}, "llaveSecretaToken", { expiresIn: "24h" });
        console.log(token)
        //configuro la cookie(se configura en post del login)
        
        return done(null, user, { token });

    } catch (error) {
            return done(error)
    }
}))


///ESTRATEGIA REGISTRO
    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"}, async(req, email, password, done)=>{
            
            const { first_name, last_name, age} = req.body;
            try {
                let user = await User.findOne({email})
                if(user){
                    console.log("Usuario ya registrado con este email")
                    return done(null,false)
                }
                
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password : createHash(password)
                }
                
                let result = await User.create(newUser)
                return done(null, result)
                
            } catch (error) {
                return done("Error al obtener el usuario" + error)
            }
        }
    ))



//ESTRETEGIA DE RESTORE

        passport.use("restore", new LocalStrategy({usernameField:"email"},async(email,password,done)=>{
            try {
                const updateUser = await User.findOneAndUpdate(
                    {email : email},
                    {password: createHash(password)},
                    {new:true}
                );
                if(!updateUser){
                    console.log("Usuario no registrado")
                    return done(null,false, {message:"usuario no registrado"})
                }

                return done(null,updateUser)
                
            } catch (error) {
                return done(error)
            }

        }))


        //ESTRATEGIA GITHUB

        passport.use("github", new GitHubStrategy({
            clientID:"Iv23lip1l9fBuxVzsQ1K",
            clientSecret:"ee752f3281ada8004ff4bf4d95b6de553d968c4c",
            callbackURL:"http://localhost:8080/api/sessions/githubcallback"
        },async(accessToken,refreshToken,profile,done)=>{
            try {
                console.log(profile)
                let user = await User.findOne({email:profile._json.email})
                if(!user){
                    let newUser = {
                        first_name:profile._json.name,
                        last_name:"",
                        age:20,
                        email:profile._json.email,
                        password:"" // al ser autoentificacion de terceros, no podemos asignarle password
                    }
                    let result = await User.create(newUser);
                    done(null,result);
                }
                else{ //si entra aca, es porque el usuario ya existia
                    done(null,user)
                }
            } catch (error) {
                return done(error)
            }
        }))


    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });

    passport.deserializeUser(async(id,done)=>{
        let user = await User.findById(id);
        done(null,user)
    })
}


    export default initializePassport