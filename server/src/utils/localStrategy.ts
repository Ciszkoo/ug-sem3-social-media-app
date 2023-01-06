import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../model/user.model";
import { getUserByEmail } from "../service/user.service";
import log from "./logger";

passport.serializeUser((user: Partial<User>, done) => {
  log.info("Serializing user...");
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  log.info("Deserializing user...");
  try {
    const user = await getUserByEmail(email);
    log.info(`User deserialized`);
    done(null, user);
  } catch (error) {
    log.error("Deserializing user failed");
    done(error, null);
  }
});

passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      log.info("Authenticating user...");
      try {
        if (!email || !password) {
          return done(null, false);
        }
        const user = await getUserByEmail(email);
        const isValid = await user.validatePassword(password);
        if (!isValid) {
          log.info("Invalid password");
          done(null, false);
        } else {
          log.info("User authenticated");
          done(null, user);
        }
      } catch (error) {
        log.error(JSON.stringify(error));
        done(error, false);
      }
    }
  )
);