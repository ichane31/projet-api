import { Injectable } from '@nestjs/common';
import {User} from '../model/user';
import userService from '../service/user.service';
import {Files} from'../model/files';
import fileService from '../service/file.service';
import passwordService from '../service/password.service';
import jwtService from './jwt.service';


@Injectable()
export class AuthService {

    async google (req , res) {
        if(!req.user) {
            res.statue(500).json({ message : `Il n'y a pas d'utilisateur google`}).redirect('');
        }
        const user = req.user;
        const password = user.email + 'google password';
        const userInfo = await userService.getByEmail(user.email);
        if(userInfo) {
            if (userInfo.googleId === null ) {
                res.status(403).json({ message : `Il ya un utilisateur avec eamail ${user.email} mais ce email n'est pas lié à google.Veuillez vous connecté avec votre email et mot de passe.`});
            }
            this.Login(res , userInfo ,password)
        } else {
             this.Register(res , user ,'google')
        }
    }


    async facebook (req , res) {
        if(!req.user) {
            res.statue(500).json({ message : `Il n'y a pas d'utilisateur facebook`}).redirect('');
        }
        const user = req.user;
        const password = user.email + 'facebook password';
        const userInfo = await userService.getByEmail(user.email);
        if(userInfo) {
            if (userInfo.facebookId === null ) {
                res.status(403).json({ message : `Il ya un utilisateur avec l'email ${user.email} mais ce email n'est pas lié à facebook.Veuillez vous connecté avec votre email et mot de passe.`});
            }
            this.Login(res , userInfo ,password)
        } else {
             this.Register(res , user ,'facebook')
        }
    }

    async twitter (req , res) {
        if(!req.user) {
            res.statue(500).json({ message : `Il n'y a pas d'utilisateur twitter`}).redirect('');
        }
        const user = req.user;
        const password = user.email + 'twitter password';
        const userInfo = await userService.getByEmail(user.email);
        if(userInfo) {
            if (userInfo.twitterId === null ) {
                res.status(403).json({ message : `Il ya un utilisateur avec l'email ${user.email} mais ce email n'est pas lié à twitter.Veuillez vous connecté avec votre email et mot de passe.`});
            }
            this.Login(res , userInfo ,password)
        } else {
             this.Register(res , user ,'twitter')
        }
    }
    async Login(res , user,password) {
        try {
            const isMatch = await passwordService.comparePassword(password,user.password);
            if(!isMatch) {
                return res.status(500).json({message: 'Incorrect password'})
            }
            const token = '';
            const refreshToken ='';
            res.cookie("refresh-auth",refreshToken ,{
                httpOnly : true,
                path:'',
                maxAge: 30*24 * 60 * 60 * 1000,
            });
            user.active = new Date();
            await userService.update(user.id, user);

            let exp : number;

            try {
                exp = ( jwtService.verify(token)).exp;
            }catch (err) {
                
            }
            res.status(200).json({ ...user, password: undefined, favorites: undefined, likes: undefined, token  ,refreshToken, exp});
		
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
        
      }

      async Register(res , user , type: string) {
        
        const newUser = new User();
        newUser.email = user.email;
        newUser.firstname = user.firstName;
        newUser.lastname = user.lastName;
        if (type === 'google'){
            newUser.googleId = user.id;
            newUser.password = user.email +'google password';
        } else if (type === 'facebook'){
            newUser.facebookId = user.id;
            newUser.password = user.email +'facebook password';
        } else if (type === 'twitter') {
            newUser.twitterId = user.id; 
            newUser.password = user.email +'twitter password';   
        }
        
        if (user.picture) {
            const newImage = new Files();
			newImage.content = user.picture.data;
			let $image = await fileService.create(newImage);
			newUser.image = $image.id;
        }

        const newCreatedUser = await userService.create(user);
        res.status(200).json( { message : 'User successfully created',
                user : newCreatedUser});
      }
}
export default new AuthService();