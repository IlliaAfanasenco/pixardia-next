export type TerminalGuard =
    | {
    allowed: true;
}
    | {
    allowed: false;
    reason: 'personal_data' | 'off_topic';
    answer: string;
};

export type ValidationLanguage = 'en' | 'de';

type RuleMessage = Record<ValidationLanguage, string>;

type ForbiddenTopicRule = {
    id: string;
    title: string;
    keywords: readonly string[];
    messages: RuleMessage;
};

export const emailRegex =
    /^(?!.*\.\.)(?!.*\.$)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

export const cardRegex = /^\d{13,19}$/;

const emailInTextRegex =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const phoneInTextRegex =
    /(?:^|[\s:(])\+?[0-9][0-9\s\-()]{6,20}[0-9](?=$|[\s.,;:)])/g;

const cardCandidateRegex = /(?:\d[\s-]?){13,19}/g;

const personalDataMessages = {
    email: {
        en: 'Please do not send email addresses through this form.',
        de: 'Bitte senden Sie keine E-Mail-Adressen über dieses Formular.',
    },
    phone: {
        en: 'Please do not send phone numbers through this form.',
        de: 'Bitte senden Sie keine Telefonnummern über dieses Formular.',
    },
    card: {
        en: 'Please do not send credit card details through this form.',
        de: 'Bitte senden Sie keine Kreditkartendaten über dieses Formular.',
    },
} as const;

export const forbiddenTopicRules = [
    {
        id: 'credit_card_data',
        title: 'Credit card data',
        keywords: [
            'card number',
            'credit card',
            'debit card',
            'cvv',
            'cvc',
            'expiry date',
            'card expiry',
            'payment card',

            'kartennummer',
            'kreditkarte',
            'debitkarte',
            'kartenprüfnummer',
            'karten prüfnummer',
            'ablaufdatum',
            'gültigkeitsdatum',
            'zahlungskarte',
        ],
        messages: {
            en: 'Please do not send credit card details through this form.',
            de: 'Bitte senden Sie keine Kreditkartendaten über dieses Formular.',
        },
    },
    {
        id: 'passwords',
        title: 'Passwords',
        keywords: [
            'password',
            'login password',
            'account password',
            'login details',
            'access data',

            'passwort',
            'login passwort',
            'konto passwort',
            'zugangsdaten',
            'anmeldedaten',
        ],
        messages: {
            en: 'Please do not send passwords or login details.',
            de: 'Bitte senden Sie keine Passwörter oder Zugangsdaten.',
        },
    },
    {
        id: 'private_keys',
        title: 'Private keys',
        keywords: [
            'private key',
            'seed phrase',
            'recovery phrase',
            'secret key',
            'wallet key',

            'privater schlüssel',
            'seed phrase',
            'wiederherstellungsphrase',
            'geheimer schlüssel',
            'wallet schlüssel',
        ],
        messages: {
            en: 'Please do not send private keys or recovery phrases.',
            de: 'Bitte senden Sie keine privaten Schlüssel oder Wiederherstellungsphrasen.',
        },
    },
    {
        id: 'bank_account_data',
        title: 'Bank account data',
        keywords: [
            'iban',
            'bic',
            'bank account',
            'account number',
            'bank details',
            'routing number',

            'bankkonto',
            'kontonummer',
            'bankdaten',
            'bankverbindung',
            'bankleitzahl',
        ],
        messages: {
            en: 'Please do not send sensitive bank details.',
            de: 'Bitte senden Sie keine sensiblen Bankdaten.',
        },
    },
    {
        id: 'personal_documents',
        title: 'Personal documents',
        keywords: [
            'passport',
            'id card',
            'identity card',
            'residence permit',
            'driver license',
            'driving license',
            'document number',

            'reisepass',
            'personalausweis',
            'ausweis',
            'aufenthaltstitel',
            'aufenthaltskarte',
            'führerschein',
            'dokumentennummer',
        ],
        messages: {
            en: 'Please do not send personal document numbers through this form.',
            de: 'Bitte senden Sie keine persönlichen Dokumentennummern über dieses Formular.',
        },
    },
    {
        id: 'illegal_services',
        title: 'Illegal services',
        keywords: [
            'illegal',
            'fake documents',
            'black market',
            'forged documents',
            'counterfeit documents',

            'gefälschte dokumente',
            'schwarzmarkt',
            'falsche dokumente',
            'dokumente fälschen',
        ],
        messages: {
            en: 'Requests related to illegal services are not allowed.',
            de: 'Anfragen zu illegalen Dienstleistungen sind nicht erlaubt.',
        },
    },
    {
        id: 'drugs',
        title: 'Drugs',
        keywords: [
            'drugs',
            'cocaine',
            'heroin',
            'mdma',
            'weed delivery',
            'drug delivery',

            'drogen',
            'kokain',
            'heroin',
            'gras lieferung',
            'drogenlieferung',
        ],
        messages: {
            en: 'Requests related to illegal drugs are not allowed.',
            de: 'Anfragen im Zusammenhang mit illegalen Drogen sind nicht erlaubt.',
        },
    },
    {
        id: 'weapons',
        title: 'Weapons',
        keywords: [
            'weapon',
            'gun',
            'firearm',
            'explosive',
            'bomb',
            'knife attack',

            'waffe',
            'pistole',
            'schusswaffe',
            'sprengstoff',
            'bombe',
            'messerangriff',
        ],
        messages: {
            en: 'Requests related to weapons or violence are not allowed.',
            de: 'Anfragen zu Waffen oder Gewalt sind nicht erlaubt.',
        },
    },
    {
        id: 'violence',
        title: 'Violence',
        keywords: [
            'kill',
            'hurt someone',
            'attack someone',
            'beat someone',
            'harm someone',

            'töten',
            'jemanden verletzen',
            'jemanden angreifen',
            'jemanden schlagen',
            'jemandem schaden',
        ],
        messages: {
            en: 'Violent requests are not allowed.',
            de: 'Gewaltbezogene Anfragen sind nicht erlaubt.',
        },
    },
    {
        id: 'adult_content',
        title: 'Adult content',
        keywords: [
            'porn',
            'escort',
            'sex service',
            'adult content',
            'explicit content',

            'porno',
            'sexdienstleistung',
            'erwachseneninhalt',
            'expliziter inhalt',
        ],
        messages: {
            en: 'Adult or explicit content is not allowed.',
            de: 'Erwachsene oder explizite Inhalte sind nicht erlaubt.',
        },
    },
    {
        id: 'hate_speech',
        title: 'Hate speech',
        keywords: [
            'hate speech',
            'racist',
            'nazi',
            'extremist',
            'discrimination',

            'hassrede',
            'rassistisch',
            'extremistisch',
            'diskriminierung',
        ],
        messages: {
            en: 'Hate speech or extremist content is not allowed.',
            de: 'Hassrede oder extremistische Inhalte sind nicht erlaubt.',
        },
    },
    {
        id: 'self_harm',
        title: 'Self harm',
        keywords: [
            'suicide',
            'self harm',
            'kill myself',
            'hurt myself',

            'suizid',
            'selbstverletzung',
            'mich töten',
            'mir schaden',
            'mich verletzen',
        ],
        messages: {
            en: 'This form cannot process self-harm related messages.',
            de: 'Dieses Formular kann keine Nachrichten zum Thema Selbstverletzung verarbeiten.',
        },
    },
    {
        id: 'scam',
        title: 'Scam',
        keywords: [
            'scam',
            'fraud',
            'steal money',
            'fake offer',
            'financial fraud',

            'betrug',
            'geld stehlen',
            'gefälschtes angebot',
            'finanzbetrug',
        ],
        messages: {
            en: 'Fraud or scam-related requests are not allowed.',
            de: 'Anfragen im Zusammenhang mit Betrug oder Scam sind nicht erlaubt.',
        },
    },
    {
        id: 'spam',
        title: 'Spam',
        keywords: [
            'bulk email',
            'mass mailing',
            'spam',
            'email database',
            'buy email list',

            'massenmailing',
            'massenversand',
            'email datenbank',
            'email liste kaufen',
        ],
        messages: {
            en: 'Spam or mass-mailing requests are not allowed.',
            de: 'Spam oder Massenversand ist nicht erlaubt.',
        },
    },
    {
        id: 'malware',
        title: 'Malware',
        keywords: [
            'malware',
            'virus',
            'stealer',
            'keylogger',
            'trojan',
            'hack account',
            'steal data',

            'datendieb',
            'keylogger',
            'trojaner',
            'konto hacken',
            'daten stehlen',
        ],
        messages: {
            en: 'Malware or hacking requests are not allowed.',
            de: 'Anfragen zu Malware oder Hacking sind nicht erlaubt.',
        },
    },
    {
        id: 'phishing',
        title: 'Phishing',
        keywords: [
            'phishing',
            'fake login page',
            'steal password',
            'fake website',
            'login clone',

            'gefälschte login seite',
            'passwort stehlen',
            'gefälschte website',
            'login kopie',
        ],
        messages: {
            en: 'Phishing-related requests are not allowed.',
            de: 'Phishing-bezogene Anfragen sind nicht erlaubt.',
        },
    },
    {
        id: 'crypto_scam',
        title: 'Crypto scam',
        keywords: [
            'crypto scam',
            'wallet stealer',
            'fake crypto investment',
            'steal crypto',
            'crypto fraud',

            'krypto scam',
            'wallet stealer',
            'gefälschte krypto investition',
            'krypto stehlen',
            'krypto betrug',
        ],
        messages: {
            en: 'Crypto scam-related requests are not allowed.',
            de: 'Anfragen im Zusammenhang mit Krypto-Betrug sind nicht erlaubt.',
        },
    },
] as const satisfies readonly ForbiddenTopicRule[];

function normalizeText(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keywordMatches(message: string, keyword: string): boolean {
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) {
        return false;
    }

    if (normalizedKeyword.includes(' ')) {
        return message.includes(normalizedKeyword);
    }

    const escapedKeyword = escapeRegExp(normalizedKeyword);

    return new RegExp(
        `(^|[^a-z0-9äöüßа-яё])${escapedKeyword}($|[^a-z0-9äöüßа-яё])`,
        'i',
    ).test(message);
}

function findForbiddenTopic(message: string) {
    const normalizedMessage = normalizeText(message);

    return forbiddenTopicRules.find((rule) =>
        rule.keywords.some((keyword) =>
            keywordMatches(normalizedMessage, keyword),
        ),
    );
}

function hasValidCardChecksum(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i -= 1) {
        let digit = Number(cardNumber[i]);

        if (Number.isNaN(digit)) {
            return false;
        }

        if (shouldDouble) {
            digit *= 2;

            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

function hasCardNumber(message: string): boolean {
    const candidates = message.match(cardCandidateRegex) ?? [];

    return candidates.some((candidate) => {
        const digitsOnly = candidate.replace(/\D/g, '');

        return (
            digitsOnly.length >= 13 &&
            digitsOnly.length <= 19 &&
            hasValidCardChecksum(digitsOnly)
        );
    });
}

function hasPhoneNumber(message: string): boolean {
    const candidates = message.match(phoneInTextRegex) ?? [];

    return candidates.some((candidate) => {
        const digitsOnly = candidate.replace(/\D/g, '');

        return digitsOnly.length >= 7 && digitsOnly.length <= 20;
    });
}

function findPersonalDataMessage(
    message: string,
    language: ValidationLanguage,
): string | null {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
        return null;
    }

    if (
        emailRegex.test(trimmedMessage) ||
        emailInTextRegex.test(trimmedMessage)
    ) {
        return personalDataMessages.email[language];
    }

    if (hasCardNumber(trimmedMessage)) {
        return personalDataMessages.card[language];
    }

    if (
        phoneRegex.test(trimmedMessage) ||
        hasPhoneNumber(trimmedMessage)
    ) {
        return personalDataMessages.phone[language];
    }

    return null;
}

export function checkMessage(
    message: string,
    language: ValidationLanguage = 'en',
): TerminalGuard {
    const personalDataMessage = findPersonalDataMessage(message, language);

    if (personalDataMessage) {
        return {
            allowed: false,
            reason: 'personal_data',
            answer: personalDataMessage,
        };
    }

    const forbiddenTopic = findForbiddenTopic(message);

    if (forbiddenTopic) {
        return {
            allowed: false,
            reason: 'off_topic',
            answer: forbiddenTopic.messages[language],
        };
    }

    return {
        allowed: true,
    };
}