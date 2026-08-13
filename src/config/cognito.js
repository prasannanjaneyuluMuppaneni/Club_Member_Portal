import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserPool
} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "ap-southeast-2_e6zf274FN",
    ClientId: "lnu5e33bda30bb1ajh80re801"
};

export const userPool = new CognitoUserPool(poolData);

export {
    AuthenticationDetails,
    CognitoUser
};
