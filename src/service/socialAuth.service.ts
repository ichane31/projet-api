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
            res.redirect('');
        }
        const user = req.user;
        const password = user.email + 'google password';
        const userInfo = await userService.getByEmail(user.email);
        if(userInfo) {
            if (userInfo.googleId === null ) {
                res.status(403);
            }
            this.googleLogin(res , userInfo ,password)
        } else {
             this.googleRegister(res , user )
        }
    }

    async googleLogin(res , user,password) {
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

      async googleRegister(res , user ) {
        
        const newUser = new User();
        newUser.email = user.email;
        newUser.firstname = user.firstName;
        newUser.lastname = user.lastName;
        newUser.googleId = user.id;
        if (user.picture) {
            const newImage = new Files();
			newImage.content = user.picture.data;
			let $image = await fileService.create(newImage);
			user.image = $image.id;
        }

        const newCreatedUser = await userService.create(user);
        res.status(200).json( { message : 'User successfully created',
                user : newCreatedUser});
      }
}