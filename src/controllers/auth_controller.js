// Importerar konfigurationsinställningar för säkra cookies och liknande.
const { SECURE, HTTP_ONLY, SAME_SITE } = require("../config");

// Importerar funktioner för att hantera autentisering, som att generera tokens och validera lösenord.
const { 
    generateAccessToken, generateRefreshToken, generateCsrfToken, 
    validateRefreshToken, comparepareHashwords, cryptPassword 
} = require('../domain/auth_handler');

// Importerar en funktion för att hämta en användare via användarnamnet.
const { getUserByUsername } = require('../domain/user_handler');

/**
 * Loggar in en användare och sätter access- och refresh-tokens som HTTP-only cookies.
 * @param {Object} req - Begäran som innehåller användarens inloggningsuppgifter.
 * @param {Object} res - Svaret som används för att skicka tillbaka data eller tokens.
 */
exports.login = async (req, res) => {
    // Hämtar användarnamn och lösenord från begäran
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }

    try {
        // Validerar om användaren finns och om lösenordet är korrekt
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).send({ message: "Authentication failed. User not found." });
        }
        const passwordIsValid = await comparepareHashwords(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Authentication failed. Incorrect password." });
        }

        // Genererar access-, refresh- och CSRF-tokens och sätter dessa som cookies
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const csrfToken = generateCsrfToken();

        res.cookie('accessToken', accessToken, {
            httpOnly: HTTP_ONLY,
            secure: SECURE,
            maxAge: 15 * 60 * 1000,  // 15 minuter
            sameSite: SAME_SITE
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: HTTP_ONLY,
            secure: SECURE,
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 dagar
            path: '/refresh',
            sameSite: SAME_SITE
        });

        res.status(200).json({ isLoggedIn: true, csrfToken });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

/**
 * Uppdaterar användarens access- och refresh-tokens och sätter dem som cookies.
 * @param {Object} req - Begäran som inkluderar refresh-token i en cookie.
 * @param {Object} res - Svaret som används för att uppdatera tokens.
 */
exports.refreshToken = (req, res) => {
    const oldRefreshToken = req.cookies['refreshToken'];
    const userData = validateRefreshToken(oldRefreshToken);

    if (!userData) {
        return res.status(401).send('Invalid refresh token');
    }

    // Skapar nya access- och refresh-tokens och sätter dem som cookies
    const newAccessToken = generateAccessToken(userData);
    const newRefreshToken = generateRefreshToken(userData);

    res.cookie('accessToken', newAccessToken, {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 15 * 60 * 1000,  // 15 minuter
        sameSite: SAME_SITE
    });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 dagar
        path: '/refresh',
        sameSite: SAME_SITE
    });

    res.send('Token refreshed successfully');
};

/**
 * Loggar ut användaren genom att tömma access- och refresh-tokens.
 * @param {Object} req - Begäran.
 * @param {Object} res - Svaret som används för att skicka tillbaka bekräftelsen för utloggning.
 */
exports.logout = (req, res) => {
    res.cookie('accessToken', '', {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 0,  // Expirerar omedelbart
        sameSite: SAME_SITE
    });

    res.cookie('refreshToken', '', {
        httpOnly: HTTP_ONLY,
        secure: SECURE,
        maxAge: 0,  // Expirerar omedelbart
        path: '/refresh',
        sameSite: SAME_SITE
    });

    res.status(200).send("Logout successful");
};

/**
 * Utför grundläggande autentisering med Authorization-headern.
 * @param {Object} req - Begäran som innehåller Authorization-headern.
 * @param {Object} res - Svaret som används för att skicka tillbaka resultatet av autentiseringen.
 */
exports.basicLogin = (req, res) => {
    const authorization = req.headers.authorization || '';
    const [username, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');

    // Kontrollera om användarnamnet och lösenordet är korrekt (exempel, ersätt med riktig validering)
    if (username === 'admin' && password === 'password') {  
        res.status(200).send("Basic login successful");
    } else {
        res.status(401).send("Authentication failed");
    }
};

/**
 * Utför anpassad inloggning (placeholder-metod).
 * @param {Object} req - Begäran som innehåller inloggningsdata.
 * @param {Object} res - Svaret som används för att skicka tillbaka resultatet av inloggningen.
 */
exports.customLogin = (req, res) => {
    res.status(200).send("Custom login successful");
};
