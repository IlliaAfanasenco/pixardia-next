import {
    type TerminalLanguage,
    type TerminalResult,
} from "./terminalContract";

export type TerminalGuardResult =
    | {
    allowed: true;
}
    | {
    allowed: false;
    result: TerminalResult;
};

const emailRegex =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const ibanRegex =
    /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]){11,30}\b/i;

const secretRegex =
    /(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:api[_\s-]?key|password|secret|access[_\s-]?token)\s*[:=]\s*["']?[A-Z0-9._-]{8,}|(?:sk|pk)[_-][A-Z0-9_-]{16,}|eyJ[A-Z0-9_-]{10,}\.[A-Z0-9_-]{10,})/i;

const internationalPhoneRegex =
    /(?:\+|00)\d(?:[\s().-]*\d){7,14}\b/g;

const labelledPhoneRegex =
    /\b(?:phone|telephone|mobile|tel|telefon|handy|mobil)\s*[:=-]?\s*\+?\d(?:[\s().-]*\d){6,14}\b/i;

const cardCandidateRegex = /(?:\d[\s-]?){13,19}/g;

const privateDataAnswers: Record<TerminalLanguage, string> = {
    en: "Please do not send contact details or private data through the AI terminal. Remove the sensitive information and describe the project without personal details, or use the contact form when you are ready.",
    de: "Bitte senden Sie keine Kontaktdaten oder privaten Informationen über das KI-Terminal. Entfernen Sie sensible Daten und beschreiben Sie das Projekt ohne persönliche Angaben oder verwenden Sie das Kontaktformular.",
};

function hasValidCardChecksum(value: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let index = value.length - 1; index >= 0; index -= 1) {
        let digit = Number(value[index]);

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
        const digits = candidate.replace(/\D/g, "");

        return (
            digits.length >= 13 &&
            digits.length <= 19 &&
            hasValidCardChecksum(digits)
        );
    });
}

function hasPhoneNumber(message: string): boolean {
    if (labelledPhoneRegex.test(message)) {
        return true;
    }

    const candidates = message.match(internationalPhoneRegex) ?? [];

    return candidates.some((candidate) => {
        const digits = candidate.replace(/\D/g, "");

        return digits.length >= 8 && digits.length <= 15;
    });
}

function hasPrivateData(message: string): boolean {
    return (
        emailRegex.test(message) ||
        ibanRegex.test(message) ||
        secretRegex.test(message) ||
        hasCardNumber(message) ||
        hasPhoneNumber(message)
    );
}

export function checkMessage(
    message: string,
    language: TerminalLanguage,
): TerminalGuardResult {
    if (!hasPrivateData(message)) {
        return {
            allowed: true,
        };
    }

    return {
        allowed: false,
        result: {
            answer: privateDataAnswers[language],
            category: "contact",
            shouldLeadToContact: true,
        },
    };
}