import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "ap-southeast-2_e6zf274FN",

            userPoolClientId: "lnu5e33bda30bb1ajh80re801",

            loginWith: {
                email: true
            },

            signUpVerificationMethod: "code",

            userAttributes: {
                email: {
                    required: true
                }
            }
        }
    }
});
