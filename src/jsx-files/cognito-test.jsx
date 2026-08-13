import React from "react";
import { createRoot } from "react-dom/client";
import { userPool } from "./config/cognito";

function Test() {
    return (
        <div style={{
            color: "white",
            background: "#090b10",
            minHeight: "100vh",
            padding: "50px",
            fontFamily: "Arial"
        }}>
            <h1>Cognito Browser Test</h1>

            <p>
                User Pool: {userPool.getUserPoolId()}
            </p>

            <p>
                Client ID: {userPool.getClientId()}
            </p>

            <p style={{color: "#70c878"}}>
                ✓ Cognito loaded successfully in the browser
            </p>
        </div>
    );
}

createRoot(document.getElementById("root")).render(
    <Test />
);
