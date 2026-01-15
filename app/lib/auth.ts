// app/auth.ts
import { betterAuth, email } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { hashPassword, verifyPassword } from "@/app/lib/password";
import sendVerificationEmail from "@/utils/sendVerificationEmail";
import { APIError } from "better-auth/api";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  trustedOrigins: [
    "http://localhost:3000",
    "http://*:3000",
    process.env.BETTER_AUTH_URL as string,
  ],
  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 100, // max requests in the window
  },
  plugins: [
    nextCookies(),
  ],
  database: mongodbAdapter(db),
  emailAndPassword: { 
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  }, 
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url }, request) => {
      void sendVerificationEmail(user, url);
    }
  },
  socialProviders: { 
    google: { 
      clientId: process.env.BETTER_AUTH_GOOGLE_ID as string, 
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
      scope: ['email','profile'],
    }
  }, 
  account: {
    modelName: "accounts",
    accountLinking: {
      enabled: false
    }
  },
  user: {
    modelName: "users",
    changeEmail: {
      enabled: true,
      requireVerification: true,
    },
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
      image: {
        type: "string",
        required: false,
        defaultValue: "https://i.sstatic.net/frlIf.png" // default avatar image
      }
    }
  },
  session: {
    modelName: "sessions",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
      strategy: "jwt", // Caching strategy
      refreshCache: {
        updateAge: 60 // Refresh when 60 seconds remain before expiry
      }
    }
  },
  databaseHooks: {
    user: {
      update: {
        before: async (data) => {
          if (data.name?.length === 0 || data.name && (data.name.length < 2 || data.name.length > 50)) {
            throw new APIError("BAD_REQUEST", {
              message: "Username must be between 2 and 50 characters long.",
            });
          }
          return { data };
        },
      },
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        },
      },
      session_data: {
        name: "session_data",
        attributes: {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        }
      },
      state: {
        name: "auth_state",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        }
      }
    }
  },
})