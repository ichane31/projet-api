import {Strategy , Profile} from 'passport-twitter';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';


@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy , 'twitter') {
    constructor() {
        super({
          clientKey: process.env.APP_ID,
          clientSecret: process.env.APP_SECRET,
          callbackURL: 'http://localhost:3000/facebook/redirect',
          includeEmail : true
        });
      }

    async validate(token: string , secret : string , profile: Profile ,
        done: (err: any, user: any, info?: any) => void,) {
        const user = {
            id: profile.id,
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            picture: profile.photos[0].value,
            token
        }
        done(null, user);
    }
 
}