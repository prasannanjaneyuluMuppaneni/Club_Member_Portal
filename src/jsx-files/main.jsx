import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { createRoot } from 'react-dom/client';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    NavLink,
    useNavigate
} from 'react-router-dom';

import './styles.css';
import './config/amplify.js';
import Admin from './admin/Admin';

import {
    signUp,
    confirmSignUp,
    resendSignUpCode,
    signIn,
    signOut,
    resetPassword,
    confirmResetPassword
} from 'aws-amplify/auth';

import onboardingFaq from './docs/01-onboarding-faq.md?raw';
import awsAccountSetup from './docs/02-aws-account-setup.md?raw';
import builderCenterPublish from './docs/03-builder-center-publish.md?raw';
import bedrockStarter from './docs/04-bedrock-starter.md?raw';
import hackathonRules from './docs/05-hackathon-rules.md?raw';
import workshopIndex from './docs/06-workshop-index.md?raw';
import lambdaPatterns from './docs/07-lambda-patterns.md?raw';
import sbgCommunity from './docs/08-sbg-community.md?raw';


/* =========================================================
   DOCUMENT LIST
   ========================================================= */

const docs = [
    ['01-onboarding-faq.md', 'Onboarding & FAQ'],
    ['02-aws-account-setup.md', 'AWS account & billing'],
    ['03-builder-center-publish.md', 'Builder Center publishing'],
    ['04-bedrock-starter.md', 'Getting started with Bedrock'],
    ['05-hackathon-rules.md', 'Hackathon rules'],
    ['06-workshop-index.md', 'Past workshops'],
    ['07-lambda-patterns.md', 'Serverless API notes'],
    ['08-sbg-community.md', 'SBG community']
];


/* =========================================================
   DOCUMENT CONTENT
   ========================================================= */

const docContents = {
    '01-onboarding-faq.md': onboardingFaq,
    '02-aws-account-setup.md': awsAccountSetup,
    '03-builder-center-publish.md': builderCenterPublish,
    '04-bedrock-starter.md': bedrockStarter,
    '05-hackathon-rules.md': hackathonRules,
    '06-workshop-index.md': workshopIndex,
    '07-lambda-patterns.md': lambdaPatterns,
    '08-sbg-community.md': sbgCommunity
};


/* =========================================================
   ADMINISTRATOR
   ========================================================= */

const administrator = {
    name: 'Shanmukha Sasi Sadineni',
    email: 'sadinenisasi@gmail.com',
    phone: '7396025334',
    role: 'AWS Student Builder Group Leader'
};


/* =========================================================
   APP
   ========================================================= */

function App() {

    const [u, setU] = useState(() => {

        try {

            return (
                JSON.parse(
                    localStorage.getItem('cmp_user')
                ) || null
            );

        } catch {

            return null;

        }

    });


    /* =====================================================
       LOGIN STATE
       ===================================================== */

    const login = (email, name) => {

        const x = {
            email,
            name:
                name ||
                email.split('@')[0] ||
                'Member'
        };

        localStorage.setItem(
            'cmp_user',
            JSON.stringify(x)
        );

        setU(x);
    };


    /* =====================================================
       LOGOUT
       ===================================================== */

    const logout = async () => {

        try {

            await signOut();

        } catch (err) {

            console.error(
                'Cognito logout error:',
                err
            );

        } finally {

            localStorage.removeItem(
                'cmp_user'
            );

            setU(null);

        }

    };


    return (

        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to={
                            u
                                ? '/dashboard'
                                : '/login'
                        }
                    />
                }
            />

            <Route
                path="/login"
                element={
                    <Auth
                        onLogin={login}
                    />
                }
            />


            <Route
                path="/signup"
                element={
                    <Auth
                        signup
                        onLogin={login}
                    />
                }
            />


            <Route
                path="/forgot-password"
                element={
                    <Auth
                        forgot
                        onLogin={login}
                    />
                }
            />


            <Route
                path="/dashboard"
                element={
                    u ? (
                        <Dashboard
                            user={u}
                            logout={logout}
                        />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />


            <Route
                path="/chat"
                element={
                    u ? (
                        <Chat
                            user={u}
                            logout={logout}
                        />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
    path="/chat"
    element={
        u ? (
            <Chat
                user={u}
                logout={logout}
            />
        ) : (
            <Navigate to="/login" />
        )
    }
/>

<Route
    path="/admin"
    element={
        u ? (
            <Admin />
        ) : (
            <Navigate to="/login" />
        )
    }
/>
	
        </Routes>

    );

}


/* =========================================================
   LAYOUT
   ========================================================= */

function Layout({
    user,
    logout,
    children
}) {

    return (

        <div className="portal">

            <aside className="side">

                <div className="brand">

                    <b>aws</b>

                    <span>
                        STUDENT BUILDER
                        <br />
                        <small>GROUPS</small>
                    </span>

                </div>


                <div className="label">
                    MEMBER PORTAL
                </div>


                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? 'nav active'
                            : 'nav'
                    }
                >
                    ⌂ &nbsp; Dashboard
                </NavLink>


                <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                        isActive
                            ? 'nav active'
                            : 'nav'
                    }
                >
                    ✦ &nbsp; AI Assistant
                </NavLink>

	<NavLink
    to="/admin"
    className={({ isActive }) =>
        isActive
            ? 'nav active'
            : 'nav'
    }
>
    ⚙ &nbsp; Admin
</NavLink>
                <div className="label kb">
                    KNOWLEDGE BASE
                </div>


                <div className="loaded">
                    ● &nbsp;8 documents loaded
                </div>


                {docs
                    .slice(0, 4)
                    .map(d => (

                        <div
                            className="mini"
                            key={d[0]}
                        >
                            MD&nbsp;&nbsp;
                            {d[1]}
                        </div>

                    ))}


                <div className="sidebottom">

                    <div className="user">

                        <i>
                            {user.name
                                ? user.name[0].toUpperCase()
                                : 'M'}
                        </i>


                        <span>

                            <b>
                                {user.name}
                            </b>

                            <small>
                                {user.email}
                            </small>

                        </span>


                        <button
                            onClick={logout}
                            title="Logout"
                        >
                            ↪
                        </button>

                    </div>


                    <small>
                        70% BASELINE · LOCAL DEMO
                    </small>

                </div>

            </aside>


            <main className="main">
                {children}
            </main>

        </div>

    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard({
    user,
    logout
}) {

    const go = useNavigate();


    return (

        <Layout
            user={user}
            logout={logout}
        >

            <header className="head">

                <div>

                    <small>
                        MEMBER PORTAL / DASHBOARD
                    </small>


                    <h1>
                        Good to see you,{' '}
                        {user.name.split(' ')[0]}.
                    </h1>


                    <p>
                        Your Student Builder Groups
                        knowledge hub.
                    </p>

                </div>


                <button
                    onClick={() =>
                        go('/chat')
                    }
                >
                    Ask the AI assistant →
                </button>

            </header>


            <section className="hero">

                <div>

                    <em>
                        STUDENT BUILDER GROUPS
                    </em>


                    <h2>
                        Your club knowledge,
                        <br />
                        <span>
                            one conversation away.
                        </span>
                    </h2>


                    <p>
                        Ask about workshops,
                        Builder Center, AWS setup,
                        hackathon rules and other
                        information from the approved
                        club documents.
                    </p>


                    <button
                        onClick={() =>
                            go('/chat')
                        }
                    >
                        Start a conversation ↗
                    </button>

                </div>


                <div className="visual">

                    <div className="ring r1" />
                    <div className="ring r2" />

                    <strong>
                        ✦
                    </strong>


                    <label>
                        8
                        <br />
                        <small>
                            source files
                        </small>
                    </label>


                    <label className="tag2">
                        RAG
                        <br />
                        <small>
                            grounded
                        </small>
                    </label>

                </div>

            </section>


            <div className="section">

                <div>

                    <em>
                        QUICK ACCESS
                    </em>

                    <h3>
                        What can you ask?
                    </h3>

                </div>


                <span>
                    Answers come from the approved
                    source pack
                </span>

            </div>


            <section className="cards">

                {[
                    [
                        '⌁',
                        'Builder Center',
                        'How to publish your project.'
                    ],
                    [
                        '◫',
                        'AWS & Bedrock',
                        'AWS account and Bedrock guidance.'
                    ],
                    [
                        '◇',
                        'Workshops',
                        'Workshop and club information.'
                    ],
                    [
                        '◎',
                        'Hackathon rules',
                        '70% baseline requirements.'
                    ]
                ].map(x => (

                    <button
                        key={x[1]}
                        onClick={() =>
                            go('/chat')
                        }
                    >

                        <i>
                            {x[0]}
                        </i>


                        <span>

                            <b>
                                {x[1]}
                            </b>


                            <small>
                                {x[2]}
                            </small>


                            <em>
                                Ask about this →
                            </em>

                        </span>

                    </button>

                ))}

            </section>


            <div className="section">

                <div>

                    <em>
                        SOURCE PACK
                    </em>


                    <h3>
                        Approved club documents
                    </h3>

                </div>


                <span>
                    8 files
                </span>

            </div>


            <section className="docgrid">

                {docs.map((d, i) => (

                    <div
                        className="doc"
                        key={d[0]}
                    >

                        <span>

                            MD{' '}

                            <small>
                                {String(i + 1)
                                    .padStart(2, '0')}
                            </small>

                        </span>


                        <b>
                            {d[1]}
                        </b>


                        <small>
                            {d[0]}
                        </small>

                    </div>

                ))}

            </section>

        </Layout>

    );

}


/* =========================================================
   DOCUMENT VIEWER
   ========================================================= */

function DocumentViewer({
    user,
    logout,
    fileName,
    title,
    content,
    onBack
}) {

    return (

        <Layout
            user={user}
            logout={logout}
        >

            <header className="head">

                <div>

                    <small>
                        MEMBER PORTAL / KNOWLEDGE BASE
                    </small>


                    <h1>
                        {title}
                    </h1>


                    <p>
                        {fileName}
                    </p>

                </div>


                <button
                    onClick={onBack}
                >
                    ← Back to assistant
                </button>

            </header>


            <section className="document-viewer">

                <article className="markdown-content">

                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>

                </article>

            </section>

        </Layout>

    );

}


/* =========================================================
   CHAT
   ========================================================= */

function Chat({
    user,
    logout
}) {

    const [selectedDoc, setSelectedDoc] =
        useState(null);


    const [msgs, setMsgs] = useState([
        {
            r: 'a',
            t:
                'Hi! I’m your Student Builder Groups assistant. Ask me anything about the approved club documents. I will only answer using information found in those documents.'
        }
    ]);


    const [q, setQ] = useState('');

    const [loading, setLoading] =
        useState(false);


    /* =====================================================
       SEARCH DOCUMENTS
       ===================================================== */

 const searchDocuments = (question) => {

    const cleanQuestion =
        question
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ');


    /*
     * =====================================================
     * SPECIAL CASE: MEETING QUESTIONS
     * Always search the FIRST document.
     * =====================================================
     */

    if (
        cleanQuestion.includes('meeting') ||
        cleanQuestion.includes('meetings')
    ) {

        const content =
            docContents['01-onboarding-faq.md'];

        if (content) {

            const paragraphs =
                content
                    .split(/\n\s*\n/)
                    .map(
                        paragraph =>
                            paragraph.trim()
                    )
                    .filter(Boolean);


            const meetingParagraphs =
                paragraphs.filter(
                    paragraph => {

                        const text =
                            paragraph.toLowerCase();

                        return (
                            text.includes('meeting') ||
                            text.includes('meetings') ||
                            text.includes('wednesday') ||
                            text.includes('6:00 pm')
                        );

                    }
                );


            if (
                meetingParagraphs.length > 0
            ) {

                return meetingParagraphs.map(
                    paragraph => ({

                        fileName:
                            '01-onboarding-faq.md',

                        paragraph,

                        score: 100

                    })
                );

            }

        }

    }


    /*
     * =====================================================
     * NORMAL DOCUMENT SEARCH
     * =====================================================
     */

    const words =
        cleanQuestion
            .split(/\s+/)
            .filter(
                word =>
                    word.length >= 3
            );


    /*
     * Ignore common English words.
     */

    const stopWords = new Set([
        'the',
        'and',
        'for',
        'are',
        'what',
        'when',
        'where',
        'which',
        'how',
        'can',
        'does',
        'this',
        'that',
        'with',
        'from',
        'about',
        'into',
        'your',
        'you',
        'have',
        'has',
        'was',
        'were',
        'will',
        'would',
        'could',
        'should',
        'please',
        'tell',
        'give',
        'show',
        'me',
        'why',
        'who',
        'not',
        'our',
        'their',
        'there',
        'they',
        'them',
        'then',
        'than',
        'also',
        'just',
        'need',
        'want',
        'know',
        'does'
    ]);


    const meaningfulWords =
        words.filter(
            word =>
                !stopWords.has(word)
        );


    /*
     * No meaningful search terms.
     */

    if (
        meaningfulWords.length === 0
    ) {
        return [];
    }


    const results = [];


    Object.entries(docContents)
        .forEach(
            ([fileName, content]) => {

                if (
                    typeof content !==
                    'string'
                ) {
                    return;
                }


                /*
                 * Divide document into
                 * paragraphs.
                 */

                const paragraphs =
                    content
                        .split(/\n\s*\n/)
                        .map(
                            paragraph =>
                                paragraph.trim()
                        )
                        .filter(Boolean);


                paragraphs.forEach(
                    paragraph => {

                        const lowerParagraph =
                            paragraph.toLowerCase();


                        let score = 0;


                        meaningfulWords
                            .forEach(word => {

                                if (
                                    lowerParagraph
                                        .includes(word)
                                ) {
                                    score++;
                                }

                            });


                        /*
                         * Require at least
                         * two matching words.
                         */

                        if (score >= 2) {

                            results.push({

                                fileName,

                                paragraph,

                                score

                            });

                        }

                    }
                );

            }
        );


    /*
     * Highest score first.
     */

    results.sort(
        (a, b) =>
            b.score - a.score
    );


    /*
     * Return only the best
     * three sections.
     */

    return results.slice(0, 3);

};
    /* =====================================================
       OPEN DOCUMENT
       ===================================================== */

    const openDocument = (
        fileName
    ) => {

        const content =
            docContents[fileName];


        if (!content) {

            console.error(
                'Document not found:',
                fileName
            );

            return;

        }


        const documentInfo =
            docs.find(
                d => d[0] === fileName
            );


        setSelectedDoc({

            fileName,

            title:
                documentInfo
                    ? documentInfo[1]
                    : fileName,

            content

        });

    };


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    const send = (
        question
    ) => {

        question =
            question.trim();


        if (
            !question ||
            loading
        ) {
            return;
        }


        setQ('');


        /*
         * Add user message.
         */

        setMsgs(
            messages => [
                ...messages,
                {
                    r: 'u',
                    t: question
                }
            ]
        );


        setLoading(true);


        /*
         * Small delay for typing effect.
         */

        setTimeout(() => {

            try {

                const results =
                    searchDocuments(
                        question
                    );


                console.log(
                    'Question:',
                    question
                );


                console.log(
                    'Document search results:',
                    results
                );


                /* =========================================
                   NO RELEVANT DOCUMENT
                   ========================================= */

                if (
                    !results ||
                    results.length === 0
                ) {

                    setMsgs(
                        messages => [

                            ...messages,

                            {
                                r: 'a',

                                t:
                                    'I could not find information related to your question in the approved club documents.',

                                admin: true

                            }

                        ]
                    );


                    return;

                }


                /* =========================================
                   DOCUMENT INFORMATION FOUND
                   ========================================= */

                const answerText =
                    results
                        .map(
                            result =>
                                result.paragraph
                        )
                        .join('\n\n');


                const sourceFiles = [
                    ...new Set(
                        results.map(
                            result =>
                                result.fileName
                        )
                    )
                ];


                setMsgs(
                    messages => [

                        ...messages,

                        {
                            r: 'a',

                            t: answerText,

                            sources:
                                sourceFiles

                        }

                    ]
                );

            }


            /* =========================================
               ERROR
               ========================================= */

            catch (error) {

                console.error(
                    'Document search error:',
                    error
                );


                setMsgs(
                    messages => [

                        ...messages,

                        {
                            r: 'a',

                            t:
                                'I was unable to search the approved club documents. Please contact the administrator.',

                            admin: true

                        }

                    ]
                );

            }


            /* =========================================
               ALWAYS STOP LOADING
               ========================================= */

            finally {

                setLoading(false);

            }

        }, 300);

    };


    /* =====================================================
       DOCUMENT VIEW
       ===================================================== */

    if (selectedDoc) {

        return (

            <DocumentViewer

                user={user}

                logout={logout}

                fileName={
                    selectedDoc.fileName
                }

                title={
                    selectedDoc.title
                }

                content={
                    selectedDoc.content
                }

                onBack={() =>
                    setSelectedDoc(null)
                }

            />

        );

    }


    /* =====================================================
       CHAT PAGE
       ===================================================== */

    return (

        <Layout
            user={user}
            logout={logout}
        >

            <header className="head">

                <div>

                    <small>
                        MEMBER PORTAL / AI ASSISTANT
                    </small>


                    <h1>
                        Club knowledge assistant
                    </h1>


                    <p>
                        Grounded only in the eight
                        approved starter documents.
                    </p>

                </div>


                <label className="ready">
                    ● Knowledge base ready
                </label>

            </header>


            <div className="chatgrid">


                {/* =================================================
                    CHAT AREA
                    ================================================= */}

                <section className="chat">


                    <div className="chatbar">

                        <b>
                            ✦
                        </b>


                        <span>

                            <strong>
                                Student Builder Assistant
                            </strong>


                            <small>
                                Document-grounded AI
                            </small>

                        </span>


                        <i>
                            SOURCE CITATIONS ON
                        </i>

                    </div>


                    {/* =================================================
                        MESSAGES
                        ================================================= */}

                    <div className="messages">

                        {msgs.map(
                            (m, i) => (

                                m.r === 'u'

                                    ?

                                    /* USER MESSAGE */

                                    <div
                                        className="row user"
                                        key={i}
                                    >

                                        <p>
                                            {m.t}
                                        </p>

                                    </div>


                                    :

                                    /* ASSISTANT MESSAGE */

                                    <div
                                        className="row"
                                        key={i}
                                    >

                                        <b className="bot">
                                            ✦
                                        </b>


                                        <div>

                                            <p>
                                                {m.t}
                                            </p>


                                            {/* =================================
                                                ADMINISTRATOR
                                                ================================= */}

                                            {m.admin && (

                                                <div
                                                    className="citation"
                                                    style={{
                                                        marginTop:
                                                            '12px'
                                                    }}
                                                >

                                                    <b>
                                                        ADMIN
                                                    </b>


                                                    <span>

                                                        <small>
                                                            CONTACT ADMINISTRATOR
                                                        </small>


                                                        <strong>
                                                            {administrator.name}
                                                        </strong>


                                                        <small>
                                                            {administrator.role}
                                                        </small>


                                                        <small>
                                                            Email:{' '}
                                                            {administrator.email}
                                                        </small>


                                                        <small>
                                                            Phone:{' '}
                                                            {administrator.phone}
                                                        </small>

                                                    </span>

                                                </div>

                                            )}


                                            {/* =================================
                                                SOURCE DOCUMENTS
                                                ================================= */}

                                            {m.sources &&
                                                m.sources.length >
                                                    0 && (

                                                    <div
                                                        className="citation"
                                                        style={{
                                                            marginTop:
                                                                '12px'
                                                        }}
                                                    >

                                                        <b>
                                                            MD
                                                        </b>


                                                        <span>

                                                            <small>
                                                                SOURCE DOCUMENTS
                                                            </small>


                                                            {m.sources.map(
                                                                source => (

                                                                    <strong
                                                                        key={
                                                                            source
                                                                        }
                                                                        style={{
                                                                            display:
                                                                                'block'
                                                                        }}
                                                                    >
                                                                        {source}
                                                                    </strong>

                                                                )
                                                            )}

                                                        </span>

                                                    </div>

                                                )}

                                        </div>

                                    </div>

                            )
                        )}


                        {/* =================================================
                            TYPING INDICATOR
                            ================================================= */}

                        {loading && (

                            <div className="row">

                                <b className="bot">
                                    ✦
                                </b>


                                <div className="typing">
                                    ● ● ●
                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        SUGGESTIONS
                        ================================================= */}

                    {msgs.length === 1 && (

                        <div className="suggest">

                            <small>
                                START WITH A QUESTION
                            </small>


                            <button
                                onClick={() =>
                                    send(
                                        'How do I publish on Builder Center?'
                                    )
                                }
                            >
                                How do I publish on Builder Center?
                            </button>


                            <button
                                onClick={() =>
                                    send(
                                        'What are the AWS deployment requirements?'
                                    )
                                }
                            >
                                AWS deployment requirements?
                            </button>


                            <button
                                onClick={() =>
                                    send(
                                        'What is in the starter pack?'
                                    )
                                }
                            >
                                What is in the starter pack?
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        MESSAGE COMPOSER
                        ================================================= */}

                    <form
                        className="composer"
                        onSubmit={event => {

                            event.preventDefault();

                            send(q);

                        }}
                    >

                        <span>
                            ✦
                        </span>


                        <input
                            value={q}
                            onChange={event =>
                                setQ(
                                    event.target.value
                                )
                            }
                            placeholder="Ask about workshops, Builder Center, AWS setup..."
                        />


                        <button
                            type="submit"
                            disabled={
                                !q.trim() ||
                                loading
                            }
                        >
                            Send ↑
                        </button>

                    </form>


                    <footer>

                        The assistant will not guess.
                        If information is not in the
                        club documents, it will direct
                        you to the campus AWS Student
                        Builder contact.

                    </footer>

                </section>


                {/* =================================================
                    SOURCE DOCUMENTS
                    ================================================= */}

                <aside className="sources">

                    <em>
                        KNOWLEDGE BASE
                    </em>


                    <h2>

                        Source documents

                        <small>
                            8
                        </small>

                    </h2>


                    <p>
                        These are the only documents
                        the assistant is allowed to use.
                    </p>


                    {docs.map(
                        (d, i) => (

                            <button
                                type="button"
                                className="source-document-button"
                                key={d[0]}
                                onClick={() =>
                                    openDocument(
                                        d[0]
                                    )
                                }
                            >

                                <i>
                                    {String(i + 1)
                                        .padStart(2, '0')}
                                </i>


                                <span>

                                    <b>
                                        {d[0]}
                                    </b>


                                    <small>
                                        {d[1]}
                                    </small>

                                </span>


                                <strong>
                                    →
                                </strong>

                            </button>

                        )
                    )}

                </aside>

            </div>

        </Layout>

    );

}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function Auth({
    signup,
    onLogin,
    forgot
}) {

    const [e, setE] =
        useState('');

    const [p, setP] =
        useState('');

    const [cp, setCp] =
        useState('');

    const [n, setN] =
        useState('');


    /* =====================================================
       SIGNUP VERIFICATION
       ===================================================== */

    const [code, setCode] =
        useState('');

    const [confirming, setConfirming] =
        useState(false);


    /* =====================================================
       FORGOT PASSWORD
       ===================================================== */

    const [resetCode, setResetCode] =
        useState('');

    const [newPassword, setNewPassword] =
        useState('');

    const [confirmNewPassword, setConfirmNewPassword] =
        useState('');

    const [forgotStep, setForgotStep] =
        useState(0);


    /* =====================================================
       GENERAL
       ===================================================== */

    const [error, setError] =
        useState('');

    const [loading, setLoading] =
        useState(false);


    /* =====================================================
       SIGNUP TIMER
       ===================================================== */

    const [seconds, setSeconds] =
        useState(60);

    const [canResend, setCanResend] =
        useState(false);


    /* =====================================================
       RESET TIMER
       ===================================================== */

    const [resetSeconds, setResetSeconds] =
        useState(60);

    const [canResendReset, setCanResendReset] =
        useState(false);


    const go = useNavigate();


    /* =====================================================
       SIGNUP RESEND TIMER
       ===================================================== */

    useEffect(() => {

        if (!confirming) {
            return;
        }


        setSeconds(60);
        setCanResend(false);


        const timer =
            setInterval(() => {

                setSeconds(prev => {

                    if (prev <= 1) {

                        clearInterval(
                            timer
                        );

                        setCanResend(
                            true
                        );

                        return 0;

                    }

                    return prev - 1;

                });

            }, 1000);


        return () =>
            clearInterval(timer);

    }, [confirming]);


    /* =====================================================
       PASSWORD RESET TIMER
       ===================================================== */

    useEffect(() => {

        if (
            !forgot ||
            forgotStep !== 2
        ) {
            return;
        }


        setResetSeconds(60);
        setCanResendReset(false);


        const timer =
            setInterval(() => {

                setResetSeconds(
                    prev => {

                        if (prev <= 1) {

                            clearInterval(
                                timer
                            );

                            setCanResendReset(
                                true
                            );

                            return 0;

                        }

                        return prev - 1;

                    }
                );

            }, 1000);


        return () =>
            clearInterval(timer);

    }, [
        forgot,
        forgotStep
    ]);


    /* =====================================================
       SIGN UP
       ===================================================== */

    const handleSignup = async (
        event
    ) => {

        event.preventDefault();

        setError('');


        if (
            !n ||
            !e ||
            !p ||
            !cp
        ) {

            setError(
                'Please fill in all fields.'
            );

            return;

        }


        if (p !== cp) {

            setError(
                'Passwords do not match.'
            );

            return;

        }


        setLoading(true);


        try {

            const {
                nextStep
            } = await signUp({

                username: e,

                password: p,

                options: {

                    userAttributes: {

                        email: e,

                        name: n

                    }

                }

            });


            console.log(
                'Signup result:',
                nextStep
            );


            if (
                nextStep.signUpStep ===
                'CONFIRM_SIGN_UP'
            ) {

                setConfirming(true);

                setCode('');

            } else {

                go('/login');

            }

        } catch (err) {

            console.error(err);


            setError(
                err.message ||
                'Unable to create account.'
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       CONFIRM SIGNUP
       ===================================================== */

    const handleConfirm = async (
        event
    ) => {

        event.preventDefault();

        setError('');


        if (!code.trim()) {

            setError(
                'Please enter the verification code.'
            );

            return;

        }


        setLoading(true);


        try {

            const result =
                await confirmSignUp({

                    username: e,

                    confirmationCode:
                        code.trim()

                });


            console.log(
                'Verification result:',
                result
            );


            setConfirming(false);

            setCode('');


            alert(
                'Email verified successfully. Please sign in.'
            );


            go('/login');

        } catch (err) {

            console.error(err);


            setError(
                err.message ||
                'Invalid verification code.'
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       RESEND SIGNUP CODE
       ===================================================== */

    const handleResend = async () => {

        if (
            !canResend ||
            loading
        ) {
            return;
        }


        setError('');
        setLoading(true);


        try {

            await resendSignUpCode({

                username: e

            });


            setSeconds(60);

            setCanResend(false);

        } catch (err) {

            console.error(err);


            setError(
                err.message ||
                'Unable to resend verification code.'
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       FORGOT PASSWORD
       ===================================================== */

    const handleForgotPassword =
        async event => {

            event.preventDefault();

            setError('');


            if (!e.trim()) {

                setError(
                    'Please enter your email address.'
                );

                return;

            }


            setLoading(true);


            try {

                const result =
                    await resetPassword({

                        username:
                            e.trim()

                    });


                console.log(
                    'Password reset result:',
                    result
                );


                if (
                    result
                        .nextStep
                        ?.resetPasswordStep ===
                    'CONFIRM_RESET_PASSWORD_WITH_CODE'
                ) {

                    setForgotStep(2);

                    setResetCode('');

                    setNewPassword('');

                    setConfirmNewPassword('');

                    setResetSeconds(60);

                    setCanResendReset(false);

                } else {

                    setError(
                        'Unable to start password reset.'
                    );

                }

            } catch (err) {

                console.error(
                    'Password reset error:',
                    err
                );


                setError(
                    err.message ||
                    'Unable to send password reset code.'
                );

            } finally {

                setLoading(false);

            }

        };


    /* =====================================================
       CONFIRM PASSWORD RESET
       ===================================================== */

    const handleConfirmReset =
        async event => {

            event.preventDefault();

            setError('');


            if (
                !resetCode.trim()
            ) {

                setError(
                    'Please enter the verification code.'
                );

                return;

            }


            if (!newPassword) {

                setError(
                    'Please enter a new password.'
                );

                return;

            }


            if (
                !confirmNewPassword
            ) {

                setError(
                    'Please confirm your new password.'
                );

                return;

            }


            if (
                newPassword !==
                confirmNewPassword
            ) {

                setError(
                    'Passwords do not match.'
                );

                return;

            }


            setLoading(true);


            try {

                await confirmResetPassword({

                    username:
                        e.trim(),

                    confirmationCode:
                        resetCode.trim(),

                    newPassword:
                        newPassword

                });


                alert(
                    'Password reset successful. Please sign in.'
                );


                setForgotStep(0);

                setResetCode('');

                setNewPassword('');

                setConfirmNewPassword('');

                setP('');

                go('/login');

            } catch (err) {

                console.error(
                    'Confirm password reset error:',
                    err
                );


                setError(
                    err.message ||
                    'Unable to reset password.'
                );

            } finally {

                setLoading(false);

            }

        };


    /* =====================================================
       RESEND PASSWORD RESET CODE
       ===================================================== */

    const handleResendResetCode =
        async () => {

            if (
                !canResendReset ||
                loading
            ) {
                return;
            }


            setError('');

            setLoading(true);


            try {

                await resetPassword({

                    username:
                        e.trim()

                });


                setResetSeconds(60);

                setCanResendReset(
                    false
                );

            } catch (err) {

                console.error(
                    'Resend reset code error:',
                    err
                );


                setError(
                    err.message ||
                    'Unable to resend verification code.'
                );

            } finally {

                setLoading(false);

            }

        };


    /* =====================================================
       LOGIN
       ===================================================== */

    const handleLogin = async (
        event
    ) => {

        event.preventDefault();

        setError('');


        if (!e || !p) {

            setError(
                'Please enter your email and password.'
            );

            return;

        }


        setLoading(true);


        try {

            const result =
                await signIn({

                    username: e,

                    password: p

                });


            console.log(
                'Login result:',
                result
            );


            if (
                result.isSignedIn
            ) {

                onLogin(
                    e,
                    e.split('@')[0] ||
                    'Member'
                );


                go('/dashboard');

            } else {

                setError(
                    'Additional authentication is required.'
                );

            }

        } catch (err) {

            console.error(err);


            setError(
                err.message ||
                'Login failed.'
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       FORGOT PASSWORD EMAIL PAGE
       ===================================================== */

    if (
        forgot &&
        forgotStep === 0
    ) {

        return (

            <div className="auth">

                <div className="authbrand">

                    aws

                    <small>
                        STUDENT BUILDER GROUPS
                    </small>

                </div>


                <div className="authbox">

                    <em>
                        PASSWORD RECOVERY
                    </em>


                    <h1>
                        Forgot your password?
                    </h1>


                    <p>
                        Enter your registered email
                        address. We'll send you a
                        verification code.
                    </p>


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={
                            handleForgotPassword
                        }
                    >

                        <label>

                            Email address


                            <input
                                type="email"
                                value={e}
                                onChange={
                                    x =>
                                        setE(
                                            x.target.value
                                        )
                                }
                                placeholder="member@example.com"
                                autoComplete="email"
                                required
                            />

                        </label>


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? 'Sending...'
                                : 'Send verification code →'}

                        </button>

                    </form>


                    <div className="switch">

                        Remember your password?{' '}

                        <a href="/login">
                            Sign in
                        </a>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       FORGOT PASSWORD CODE PAGE
       ===================================================== */

    if (
        forgot &&
        forgotStep === 2
    ) {

        return (

            <div className="auth">

                <div className="authbrand">

                    aws

                    <small>
                        STUDENT BUILDER GROUPS
                    </small>

                </div>


                <div className="authbox">

                    <em>
                        PASSWORD RECOVERY
                    </em>


                    <h1>
                        Reset your password
                    </h1>


                    <p>
                        Enter the verification code
                        sent to:
                    </p>


                    <p>
                        <strong>
                            {e}
                        </strong>
                    </p>


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={
                            handleConfirmReset
                        }
                    >

                        <label>

                            Verification code


                            <input
                                type="text"
                                value={resetCode}
                                onChange={
                                    x =>
                                        setResetCode(
                                            x.target.value
                                        )
                                }
                                placeholder="Enter 6-digit code"
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                required
                            />

                        </label>


                        <label>

                            New password


                            <input
                                type="password"
                                value={newPassword}
                                onChange={
                                    x =>
                                        setNewPassword(
                                            x.target.value
                                        )
                                }
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                            />

                        </label>


                        <label>

                            Confirm new password


                            <input
                                type="password"
                                value={
                                    confirmNewPassword
                                }
                                onChange={
                                    x =>
                                        setConfirmNewPassword(
                                            x.target.value
                                        )
                                }
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                            />


                            {confirmNewPassword &&
                                newPassword !==
                                    confirmNewPassword && (

                                    <small
                                        style={{
                                            color:
                                                '#ff7777',
                                            fontSize:
                                                '8px'
                                        }}
                                    >
                                        Passwords do not match
                                    </small>

                                )}


                            {confirmNewPassword &&
                                newPassword ===
                                    confirmNewPassword && (

                                    <small
                                        style={{
                                            color:
                                                '#72c581',
                                            fontSize:
                                                '8px'
                                        }}
                                    >
                                        ✓ Passwords match
                                    </small>

                                )}

                        </label>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !resetCode.trim() ||
                                !newPassword ||
                                !confirmNewPassword ||
                                newPassword !==
                                    confirmNewPassword
                            }
                        >

                            {loading
                                ? 'Updating password...'
                                : 'Reset password →'}

                        </button>

                    </form>


                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '18px',
                            fontSize: '9px',
                            color: '#68717f'
                        }}
                    >

                        {!canResendReset ? (

                            <>
                                Didn't receive the code?
                                <br />

                                Resend available in{' '}

                                <strong
                                    style={{
                                        color:
                                            '#ffad33'
                                    }}
                                >
                                    {resetSeconds}s
                                </strong>
                            </>

                        ) : (

                            <button
                                type="button"
                                onClick={
                                    handleResendResetCode
                                }
                                disabled={loading}
                                style={{
                                    background:
                                        'none',
                                    border:
                                        'none',
                                    color:
                                        '#ffad33',
                                    padding: 0,
                                    fontSize:
                                        '9px',
                                    fontWeight:
                                        '700'
                                }}
                            >

                                {loading
                                    ? 'Sending...'
                                    : 'Resend verification code'}

                            </button>

                        )}

                    </div>


                    <div className="switch">

                        <a href="/login">
                            Back to sign in
                        </a>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       SIGNUP VERIFICATION PAGE
       ===================================================== */

    if (confirming) {

        return (

            <div className="auth">

                <div className="authbrand">

                    aws

                    <small>
                        STUDENT BUILDER GROUPS
                    </small>

                </div>


                <div className="authbox">

                    <em>
                        EMAIL VERIFICATION
                    </em>


                    <h1>
                        Verify your account
                    </h1>


                    <p>
                        We sent a verification code to:
                    </p>


                    <p>
                        <strong>
                            {e}
                        </strong>
                    </p>


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={
                            handleConfirm
                        }
                    >

                        <label>

                            Verification code


                            <input
                                type="text"
                                value={code}
                                onChange={
                                    x =>
                                        setCode(
                                            x.target.value
                                        )
                                }
                                placeholder="Enter 6-digit code"
                                autoComplete="one-time-code"
                            />

                        </label>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !code.trim()
                            }
                        >

                            {loading
                                ? 'Verifying...'
                                : 'Verify account →'}

                        </button>

                    </form>


                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '18px',
                            fontSize: '9px',
                            color: '#68717f'
                        }}
                    >

                        {!canResend ? (

                            <>
                                Didn't receive the code?
                                <br />

                                Resend available in{' '}

                                <strong
                                    style={{
                                        color:
                                            '#ffad33'
                                    }}
                                >
                                    {seconds}s
                                </strong>
                            </>

                        ) : (

                            <button
                                type="button"
                                onClick={
                                    handleResend
                                }
                                disabled={loading}
                                style={{
                                    background:
                                        'none',
                                    border:
                                        'none',
                                    color:
                                        '#ffad33',
                                    padding: 0,
                                    fontSize:
                                        '9px',
                                    fontWeight:
                                        '700'
                                }}
                            >

                                {loading
                                    ? 'Sending...'
                                    : 'Resend verification code'}

                            </button>

                        )}

                    </div>


                    <div className="switch">

                        Wrong email?{' '}

                        <a href="/signup">
                            Go back
                        </a>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       LOGIN / SIGNUP PAGE
       ===================================================== */

    return (

        <div className="auth">

            <div className="authbrand">

                aws

                <small>
                    STUDENT BUILDER GROUPS
                </small>

            </div>


            <div className="authbox">

                <em>
                    CLUB MEMBER PORTAL
                </em>


                <h1>

                    {signup
                        ? 'Create your account'
                        : 'Welcome back'}

                </h1>


                <p>
                    Sign in to access your member
                    dashboard and AI assistant.
                </p>


                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={
                        signup
                            ? handleSignup
                            : handleLogin
                    }
                >


                    {/* =====================================
                        FULL NAME
                        ===================================== */}

                    {signup && (

                        <label>

                            Full name


                            <input
                                type="text"
                                value={n}
                                onChange={
                                    x =>
                                        setN(
                                            x.target.value
                                        )
                                }
                                placeholder="Your name"
                                autoComplete="name"
                                required
                            />

                        </label>

                    )}


                    {/* =====================================
                        EMAIL
                        ===================================== */}

                    <label>

                        Email address


                        <input
                            type="email"
                            value={e}
                            onChange={
                                x =>
                                    setE(
                                        x.target.value
                                    )
                            }
                            placeholder="member@example.com"
                            autoComplete="email"
                            required
                        />

                    </label>


                    {/* =====================================
                        PASSWORD
                        ===================================== */}

                    <label>

                        Password


                        <input
                            type="password"
                            value={p}
                            onChange={
                                x =>
                                    setP(
                                        x.target.value
                                    )
                            }
                            placeholder="••••••••"
                            autoComplete={
                                signup
                                    ? 'new-password'
                                    : 'current-password'
                            }
                            required
                        />

                    </label>


                    {/* =====================================
                        CONFIRM PASSWORD
                        ===================================== */}

                    {signup && (

                        <label>

                            Confirm Password


                            <input
                                type="password"
                                value={cp}
                                onChange={
                                    x =>
                                        setCp(
                                            x.target.value
                                        )
                                }
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                            />


                            {cp &&
                                p !== cp && (

                                    <small
                                        style={{
                                            color:
                                                '#ff7777',
                                            fontSize:
                                                '8px'
                                        }}
                                    >
                                        Passwords do not match
                                    </small>

                                )}


                            {cp &&
                                p === cp && (

                                    <small
                                        style={{
                                            color:
                                                '#72c581',
                                            fontSize:
                                                '8px'
                                        }}
                                    >
                                        ✓ Passwords match
                                    </small>

                                )}

                        </label>

                    )}


                    {/* =====================================
                        FORGOT PASSWORD
                        ===================================== */}

                    {!signup && (

                        <a href="/forgot-password">
                            Forgot password?
                        </a>

                    )}


                    {/* =====================================
                        SUBMIT
                        ===================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? 'Please wait...'
                            : signup
                                ? 'Create account →'
                                : 'Sign in →'}

                    </button>

                </form>


                {/* =====================================
                    LOGIN / SIGNUP SWITCH
                    ===================================== */}

                <div className="switch">

                    {signup
                        ? 'Already a member?'
                        : 'New to the club?'}

                    {' '}


                    <a
                        href={
                            signup
                                ? '/login'
                                : '/signup'
                        }
                    >

                        {signup
                            ? 'Sign in'
                            : 'Create an account'}

                    </a>

                </div>

            </div>

        </div>

    );

}


/* =========================================================
   START REACT APPLICATION
   ========================================================= */

createRoot(
    document.getElementById('root')
).render(

    <BrowserRouter>

        <App />

    </BrowserRouter>

);
