"use client";

import React, { useState } from "react";
import { Loader2, Check } from "lucide-react";

export function Button({ onClick, children, disabled, className = "", ...props }) {
    const [state, setState] = useState("idle"); // 'idle' | 'loading' | 'success'

    const handleClick = async (e) => {
        if (state !== "idle" || disabled) return;

        setState("loading");
        try {
            await onClick?.(e);
            setState("success");
            setTimeout(() => setState("idle"), 2000);
        } catch (error) {
            setState("idle");
            console.error("Button action failed:", error);
        }
    };

    const buttonStyle = {
        background: 'linear-gradient(to right, #6366F1, #8B5CF6)',
        color: 'white',
        padding: '0.625rem 2rem',
        borderRadius: '0.75rem',
        fontWeight: 'bold',
        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.1)',
        border: 'none',
        cursor: state === "idle" && !disabled ? 'pointer' : 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'center',
        opacity: state !== "idle" || disabled ? 0.5 : 1,
        transition: 'all 0.2s',
    };

    return (
        <button
            onClick={handleClick}
            disabled={state !== "idle" || disabled}
            style={buttonStyle}
            className={className}
            {...props}
        >
            {state === "loading" && (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                </>
            )}
            {state === "success" && (
                <>
                    <Check className="w-4 h-4" />
                    Published!
                </>
            )}
            {state === "idle" && children}
        </button>
    );
}
