"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AdvisorMessage } from "./ChatMessage";
import {
    INTRO_STEP,
    NOT_SURE,
    STARTERS,
    applyAnswer,
    buildSummary,
    initialAnswers,
    nextStep,
    type Answers,
    type Mode,
    type Step,
} from "./flow";

type Translate = (message: string) => string;

type Session = {
    messages: AdvisorMessage[];
    answers: Answers;
    /** The question currently waiting for an answer, or null while the desk is "typing". */
    step: Step | null;
};

const REPLY_DELAY_MS = 650;

function deskMessage(id: string, step: Step, answers: Answers, lead: string, t: Translate): AdvisorMessage {
    if (step.id === "summary") {
        return {
            id,
            role: "ai",
            text: t(step.question),
            summary: {
                title: t("PROJECT SUMMARY"),
                rows: buildSummary(answers, t),
                ctaLabel: t("DISCUSS THIS PROJECT →"),
                note: t("Preview only — nothing has been sent."),
            },
        };
    }
    return {
        id,
        role: "ai",
        text: `${lead}${t(step.question)}`,
        hint: step.hint ? t(step.hint) : undefined,
    };
}

export function useProjectDesk(t: Translate) {
    const makeInitial = useCallback(
        (): Session => ({
            messages: [deskMessage("intro", INTRO_STEP, initialAnswers(), "", t)],
            answers: initialAnswers(),
            step: INTRO_STEP,
        }),
        [t],
    );

    const [session, setSession] = useState<Session>(makeInitial);
    const [past, setPast] = useState<Session[]>([]);
    const [input, setInput] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const counter = useRef(0);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const isTyping = session.step === null;

    /** Records the visitor's answer, then lets the desk "type" the next question. */
    const commit = useCallback(
        (answers: Answers, shown: string, lead: string, previous: Session) => {
            const step = nextStep(answers);
            counter.current += 1;
            const id = counter.current;

            setPast((current) => [...current, previous]);
            setSession({
                answers,
                step: null,
                messages: [...previous.messages, { id: `user-${id}`, role: "user", text: shown }],
            });
            setSelected([]);
            setInput("");

            timer.current = setTimeout(() => {
                setSession((current) => ({
                    answers,
                    step,
                    messages: [...current.messages, deskMessage(`desk-${id}`, step, answers, lead, t)],
                }));
            }, REPLY_DELAY_MS);
        },
        [t],
    );

    const answer = useCallback(
        (value: string | string[], shown?: string) => {
            const { step } = session;
            if (!step || step.id === "summary") return;

            const next = applyAnswer(session.answers, step, value);
            const lead =
                step.id === "intent"
                    ? `${t(next.category ? "Sounds good." : "Got it.")} `
                    : step.id === "category"
                      ? `${t("Sounds good.")} `
                      : "";
            const text = shown ?? (Array.isArray(value) ? value.map(t).join(", ") : t(value));

            commit(next, text, lead, session);
        },
        [session, commit, t],
    );

    const submitText = useCallback(() => {
        const text = input.trim();
        if (text) answer(stepValue(session.step, text), text);
    }, [input, answer, session.step]);

    const toggle = useCallback((option: string) => {
        setSelected((current) => {
            if (option === NOT_SURE) return current.includes(option) ? [] : [option];
            const rest = current.filter((item) => item !== NOT_SURE);
            return rest.includes(option) ? rest.filter((item) => item !== option) : [...rest, option];
        });
    }, []);

    const submitSelection = useCallback(() => {
        if (selected.length) answer(selected);
    }, [selected, answer]);

    const skip = useCallback(() => {
        const { step } = session;
        if (!step?.skippable) return;
        answer(step.multi ? [NOT_SURE] : NOT_SURE);
    }, [session, answer]);

    /** Starts the guided conversation from one of the two cards. */
    const begin = useCallback(
        (mode: Mode) => {
            if (isTyping) return;
            if (timer.current) clearTimeout(timer.current);
            const base: Session = { ...makeInitial(), answers: { ...initialAnswers(), mode } };
            commit(base.answers, t(STARTERS[mode]), "", base);
            setPast([base]);
        },
        [isTyping, makeInitial, commit, t],
    );

    const back = useCallback(() => {
        if (isTyping || past.length === 0) return;
        setSession(past[past.length - 1]);
        setPast(past.slice(0, -1));
        setSelected([]);
        setInput("");
    }, [isTyping, past]);

    const restart = useCallback(() => {
        if (timer.current) clearTimeout(timer.current);
        setSession(makeInitial());
        setPast([]);
        setSelected([]);
        setInput("");
    }, [makeInitial]);

    return {
        messages: session.messages,
        step: session.step,
        isTyping,
        input,
        setInput,
        selected,
        toggle,
        answer,
        submitText,
        submitSelection,
        skip,
        begin,
        back,
        restart,
        canGoBack: !isTyping && past.length > 0,
    };
}

/** Typed text answers a multi-select step as a single custom entry. */
function stepValue(step: Step | null, text: string): string | string[] {
    return step?.multi ? [text] : text;
}
