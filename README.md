# Club_Member_Portal

Student Builder Groups — Club Member Portal

A React-based club member portal with an AI-powered knowledge assistant, approved source documents, document viewing, and an admin document publishing interface.

Overview

The portal provides members with:

A club dashboard

An AI knowledge assistant

An approved knowledge base

Source-document viewing

Document-grounded question answering

Login, signup, and password-reset interfaces

Administrators can:

Upload .md and .txt files

Paste document content

Publish new documents

Update an existing document

Add documents after the original starter documents

Make newly published documents available to the knowledge base

Main Workflow

Member
  |
  v
Dashboard
  |
  +----> AI Assistant ----> Knowledge Base ----> Document Viewer
  |
  +----> Admin

Admin
  |
  v
Upload / Paste Document
  |
  v
Publish
  |
  v
Knowledge Base
  |
  v
AI Assistant

Features

Member Portal

Dark-themed responsive interface

Dashboard

Sidebar navigation

Knowledge-base document list

Source document viewer

AI assistant interface

AI Assistant

The assistant is designed to answer questions using the approved club documents.

The intended flow is:

User question
     |
     v
Available documents
     |
     v
Relevant document content
     |
     v
Answer
     |
     v
Source document

Admin Document Management

The Admin page supports:

Entering a document name

Uploading .md or .txt files

Automatically reading uploaded files

Pasting document content

Publishing documents

Updating documents with the same filename

Clearing the form

Returning to the dashboard

New documents are appended after the original starter documents.

Starter Knowledge Base

The application starts with these approved documents:

01-onboarding-faq.md
02-aws-account-setup.md
03-builder-center-publish.md
04-bedrock-starter.md
05-hackathon-rules.md
06-workshop-index.md
07-lambda-patterns.md
08-sbg-community.md

If an administrator publishes:

event-day-briefing.md

the Knowledge Base becomes:

01-onboarding-faq.md
02-aws-account-setup.md
03-builder-center-publish.md
04-bedrock-starter.md
05-hackathon-rules.md
06-workshop-index.md
07-lambda-patterns.md
08-sbg-community.md
09-event-day-briefing.md

Clicking the new document opens its stored content.

Technologies

Frontend

React

JavaScript

JSX

CSS

Vite

React Router

Local document management

Browser localStorage

Custom browser events for updating the knowledge base

AWS / AI architecture

The project is designed to integrate with AWS services such as:

Amazon Cognito

Amazon Bedrock

Amazon S3

AWS Lambda

Amazon API Gateway

Amazon CloudWatch

The current frontend document publishing flow uses browser storage for local development and demonstration. A production deployment can replace this with persistent AWS storage and server-side document ingestion.

Project Structure

Club-Member-Portal-Dashboard-Chat-UI/
|
+-- dist/
+-- node_modules/
|
+-- src/
|   |
|   +-- admin/
|   |   +-- Admin.jsx
|   |
|   +-- config/
|   +-- data/
|   +-- docs/
|   |
|   +-- amplify-test.jsx
|   +-- cognito-test.jsx
|   +-- main.jsx
|   +-- styles.css
|
+-- index.html
+-- package.json
+-- package-lock.json
+-- README.md

Requirements

Install:

Node.js

npm

Git

A modern web browser

Check Node.js:

node --version

Check npm:

npm --version

Installation

Clone the repository:

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Club-Member-Portal-Dashboard-Chat-UI

Install dependencies:

npm install

Run the Project

Start the Vite development server:

npm run dev

Open the URL shown by Vite, normally:

http://localhost:5173

Application Routes

Dashboard

/

or:

/dashboard

AI Assistant

/chat

Admin

/admin

Publishing a Document

Open:

http://localhost:5173/admin

Enter a filename such as:

event-day-briefing.md

Then either upload the file or paste its content.

Example:

# Event Day Briefing

The event starts at 10 AM.

Students must bring their laptops.

Judging will take place in Room B.

Click:

Publish Document →

The frontend stores dynamically published documents under:

cmp_dynamic_docs

in browser localStorage.

The application then dispatches:

club-documents-updated

so the dashboard/AI assistant can refresh its document list.

Updating a Document

Publishing the same filename again updates the existing document instead of creating a duplicate.

For example:

event-day-briefing.md

can be republished with updated content.

Opening a Document

The Knowledge Base displays the original starter documents followed by dynamically published documents.

Clicking a document opens its content in the document viewer.

Document Search

The AI Assistant can use the available document contents when processing questions.

The intended architecture is:

Question
   |
   v
Document search
   |
   v
Relevant content
   |
   v
AI response
   |
   v
Source citation

AWS Architecture

A production architecture can use:

                    +----------------+
                    |     Member     |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    |  React Portal  |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    |  API Gateway   |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | AWS Lambda     |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | Amazon Bedrock |
                    +-------+--------+
                            |
                            v
                    +----------------+
                    | Knowledge Base |
                    +----------------+

Document ingestion can follow:

Admin
  |
  v
Upload document
  |
  v
Amazon S3
  |
  v
AWS Lambda
  |
  v
Document processing
  |
  v
Embedding / indexing
  |
  v
Knowledge Base
  |
  v
AI Assistant

AWS Services

Service

Purpose

Amazon Cognito

Authentication and user management

Amazon Bedrock

Generative AI / foundation models

Amazon S3

Document storage

AWS Lambda

Serverless backend processing

Amazon API Gateway

Backend API endpoints

Amazon CloudWatch

Logging and monitoring

Authentication

A production authentication flow can use Amazon Cognito:

User
 |
 v
React Login
 |
 v
Amazon Cognito
 |
 +-- Sign Up
 +-- Sign In
 +-- Password Reset
 +-- Token Management

The project includes authentication UI components that can be connected to Cognito.

Testing

Build the application:

npm run build

Run the development server:

npm run dev

Test document publishing:

Open /admin

Enter a document name

Upload or paste document content

Click Publish Document

Open /chat

Check the Knowledge Base

Confirm the new document appears after the starter documents

Click the document

Confirm its content opens

Ask a question whose answer is contained in the new document

Troubleshooting

Blank page

Open the browser developer console:

Ctrl + Shift + J

Check the first JavaScript error.

Also check the Vite terminal.

Build error

Run:

npm run build

Fix the first error reported by Vite before investigating later errors.

New document does not appear

Check the browser console:

localStorage.getItem("cmp_dynamic_docs")

If it returns null, no dynamic document has been saved.

If JSON is returned, verify that the Chat page reads the same storage key.

Reset dynamically published documents

To clear locally published documents:

localStorage.removeItem("cmp_dynamic_docs");

Then refresh the application.

Production Improvements

The current browser-storage implementation is useful for local development and demonstration. For a production deployment, the following improvements are recommended:

Amazon Cognito authentication

Admin role authorization

Amazon S3 document storage

Persistent document metadata

AWS Lambda document processing

Amazon Bedrock integration

Automated document ingestion

Vector retrieval

Server-side validation

Document deletion

Document version history

CloudWatch monitoring

Automated tests

CI/CD deployment

Production RAG Flow

Admin
  |
  v
S3 document upload
  |
  v
Document processing
  |
  v
Chunking
  |
  v
Embeddings
  |
  v
Knowledge Base / vector retrieval
  |
  v
User question
  |
  v
Retrieve relevant chunks
  |
  v
Amazon Bedrock
  |
  v
Grounded answer + sources

Build for Production

Create a production build:

npm run build

The production files are generated in:

dist/

Preview the production build:

npm run preview

GitHub Setup

Initialize Git if required:

git init

Add files:

git add .

Commit:

git commit -m "Initial Student Builder Groups portal"

Add the GitHub repository:

git remote add origin <YOUR_GITHUB_REPOSITORY_URL>

Push:

git branch -M main
git push -u origin main

Security

Never commit secrets to GitHub.

Do not upload:

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
passwords
private keys
authentication tokens
API secrets
.env files containing secrets

Recommended .gitignore:

node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode/

Environment Variables

If AWS services are connected later, use environment variables.

Example:

VITE_AWS_REGION=your-region
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_API_URL=your-api-url

Do not commit the actual secret values.

Project Goals

The project focuses on:

Creating a modern club member portal

Providing a centralized knowledge base

Providing a document-grounded AI assistant

Allowing administrators to manage knowledge documents

Keeping AI responses grounded in approved source material

Providing a foundation for AWS-based deployment

Making newly published documents available to the assistant

Future Enhancements

Complete Amazon Cognito integration

Complete Amazon Bedrock integration

Persistent S3 document storage

Backend document ingestion

Vector retrieval

Admin role-based access control

Document deletion

Document versioning

Source citation improvements

Automated testing

CI/CD pipeline

Production deployment

License

This project is intended for educational, internship, hackathon, and student club project use.

Add an appropriate open-source license before distributing the project publicly.

Student Builder Groups

Club Member Portal & AI Knowledge Assistant

A student-focused portal for accessing approved club resources and interacting with a document-grounded AI assistant.
