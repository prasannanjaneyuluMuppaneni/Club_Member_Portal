import React from "react";
import { createRoot } from "react-dom/client";
import "./config/amplify.js";

function Test() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#090b10",
            color: "white",
            padding: "50px",
            fontFamily: "Arial"
        }}>
            <h1>Amplify Cognito Test</h1>

            <p style={{ color: "#70c878" }}>
                ✓ Amplify loaded successfully
            </p>

            <p>
                User Pool: ap-southeast-2_e6zf274FN
            </p>

            <p>
                Client ID: lnu5e33bda30bb1ajh80re801
            </p>
        </div>
    );
}

createRoot(document.getElementById("root")).render(
    <Test />
);
