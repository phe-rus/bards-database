'use client'
import { HTMLInputTypeAttribute } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FetchProps = {
    input: string;
    method: string;
    body: Record<string, unknown>;
}

export const Fetch = async (p0: string, p1: string, p2: { email: string; password: string; }, { input, method, body }: FetchProps) => {
    try {
        const response = await fetch(input, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // Handle HTTP errors
            const errorText = await response.text(); // Read the error message
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw error for further handling if needed
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FieldTextProps = {
    label: string;
    type: HTMLInputTypeAttribute | undefined;
    placeholder?: string | undefined;
    required?: boolean | false;
    value?: string | undefined;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const FieldText = ({ label, type, placeholder, required, value, onChange }: FieldTextProps) => {
    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={label}>{label}</Label>
            <Input
                id={label}
                type={type}
                placeholder={placeholder}
                required={required}
                className='rounded-none'
                value={value}
                onChange={onChange}
            />
        </div>
    )
}