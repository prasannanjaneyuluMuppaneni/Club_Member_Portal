import React, { useState } from "react";

const DYNAMIC_DOCS_KEY = "cmp_dynamic_docs";

export default function Admin() {
    const [documentName, setDocumentName] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // =====================================================
    // HANDLE FILE UPLOAD
    // =====================================================

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const extension =
            "." +
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        // Only allow Markdown and text files
        if (![".md", ".txt"].includes(extension)) {
            setMessage(
                "Please upload a .md or .txt file."
            );
            setMessageType("error");
            return;
        }

        // Put filename into document-name field
        setDocumentName(file.name);

        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target?.result;

            if (typeof fileContent === "string") {
                setContent(fileContent);

                setMessage(
                    "Document loaded successfully. Click Publish Document."
                );

                setMessageType("success");
            } else {
                setMessage(
                    "Unable to read the document."
                );

                setMessageType("error");
            }
        };

        reader.onerror = () => {
            setMessage(
                "Error reading the selected file."
            );

            setMessageType("error");
        };

        reader.readAsText(file);
    };

    // =====================================================
    // PUBLISH DOCUMENT
    // =====================================================

    const handlePublish = () => {
        const name = documentName.trim();
        const text = content.trim();

        // Validate document name
        if (!name) {
            setMessage(
                "Please enter a document name."
            );
            setMessageType("error");
            return;
        }

        // Validate extension
        if (
            !name.toLowerCase().endsWith(".md") &&
            !name.toLowerCase().endsWith(".txt")
        ) {
            setMessage(
                "Document name must end with .md or .txt."
            );
            setMessageType("error");
            return;
        }

        // Validate content
        if (!text) {
            setMessage(
                "Please upload a document or enter document content."
            );
            setMessageType("error");
            return;
        }

        try {
            // ---------------------------------------------
            // Get existing admin documents
            // ---------------------------------------------

            const saved =
                localStorage.getItem(
                    DYNAMIC_DOCS_KEY
                );

            let documents = [];

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    if (Array.isArray(parsed)) {
                        documents = parsed;
                    }
                } catch (error) {
                    console.error(
                        "Error parsing saved documents:",
                        error
                    );

                    documents = [];
                }
            }

            // ---------------------------------------------
            // Create new document
            // ---------------------------------------------

            const newDocument = {
                name: name,

                title: name.replace(
                    /\.(md|txt)$/i,
                    ""
                ),

                content: text,

                updatedAt:
                    new Date().toISOString()
            };

            // ---------------------------------------------
            // Check whether document already exists
            // ---------------------------------------------

            const existingIndex =
                documents.findIndex(
                    (doc) =>
                        doc &&
                        typeof doc.name === "string" &&
                        doc.name.toLowerCase() ===
                            name.toLowerCase()
                );

            // ---------------------------------------------
            // Update existing document
            // OR
            // Add new document
            // ---------------------------------------------

            if (existingIndex !== -1) {
                documents[existingIndex] =
                    newDocument;
            } else {
                documents.push(newDocument);
            }

            // ---------------------------------------------
            // SAVE TO LOCAL STORAGE
            // ---------------------------------------------

            localStorage.setItem(
                DYNAMIC_DOCS_KEY,
                JSON.stringify(documents)
            );

            // ---------------------------------------------
            // Notify the Chat page
            // ---------------------------------------------

            window.dispatchEvent(
                new Event(
                    "club-documents-updated"
                )
            );

            // Also notify other browser tabs/windows
            localStorage.setItem(
                "cmp_documents_last_updated",
                Date.now().toString()
            );

            // ---------------------------------------------
            // Success message
            // ---------------------------------------------

            if (existingIndex !== -1) {
                setMessage(
                    `"${name}" updated successfully.`
                );
            } else {
                setMessage(
                    `"${name}" published successfully. It was added after the original 8 documents.`
                );
            }

            setMessageType("success");

            // ---------------------------------------------
            // Clear form
            // ---------------------------------------------

            setDocumentName("");
            setContent("");

            const fileInput =
                document.getElementById(
                    "document-file"
                );

            if (fileInput) {
                fileInput.value = "";
            }

        } catch (error) {
            console.error(
                "Document publish error:",
                error
            );

            setMessage(
                "Unable to publish the document."
            );

            setMessageType("error");
        }
    };

    // =====================================================
    // CLEAR
    // =====================================================

    const handleClear = () => {
        setDocumentName("");
        setContent("");
        setMessage("");
        setMessageType("");

        const fileInput =
            document.getElementById(
                "document-file"
            );

        if (fileInput) {
            fileInput.value = "";
        }
    };

    // =====================================================
    // BACK TO DASHBOARD
    // =====================================================

    const handleBackToDashboard = () => {
        window.location.href = "/dashboard";
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <main className="admin-page">

            {/* =================================================
                HEADER
                ================================================= */}

            <div className="admin-header">

                <button
                    type="button"
                    className="admin-back"
                    onClick={handleBackToDashboard}
                >
                    ← Back to Dashboard
                </button>

                <small>
                    MEMBER PORTAL / ADMIN
                </small>

                <h1>
                    Document Management
                </h1>

                <p>
                    Add or update club knowledge documents.
                </p>

            </div>


            {/* =================================================
                ADMIN CARD
                ================================================= */}

            <section className="admin-card">

                {/* DOCUMENT NAME */}

                <label htmlFor="document-name">
                    Document name
                </label>

                <input
                    id="document-name"
                    type="text"
                    value={documentName}
                    onChange={(event) => {
                        setDocumentName(
                            event.target.value
                        );

                        setMessage("");
                        setMessageType("");
                    }}
                    placeholder="event-day-briefing.md"
                />


                {/* FILE UPLOAD */}

                <label htmlFor="document-file">
                    Upload document
                </label>

                <input
                    id="document-file"
                    type="file"
                    accept=".md,.txt"
                    onChange={handleFileUpload}
                />


                {/* OR */}

                <div className="admin-or">
                    OR
                </div>


                {/* DOCUMENT CONTENT */}

                <label htmlFor="document-content">
                    Document content
                </label>

                <textarea
                    id="document-content"
                    value={content}
                    onChange={(event) => {
                        setContent(
                            event.target.value
                        );

                        setMessage("");
                        setMessageType("");
                    }}
                    placeholder="Paste your document content here..."
                    rows={18}
                />


                {/* BUTTONS */}

                <div className="admin-actions">

                    <button
                        type="button"
                        className="admin-publish"
                        onClick={handlePublish}
                    >
                        Publish Document →
                    </button>

                    <button
                        type="button"
                        className="admin-clear"
                        onClick={handleClear}
                    >
                        Clear
                    </button>

                </div>


                {/* STATUS MESSAGE */}

                {message && (
                    <div
                        className={
                            messageType === "success"
                                ? "admin-message admin-success"
                                : "admin-message admin-error"
                        }
                    >
                        {message}
                    </div>
                )}

            </section>

        </main>
    );
}
