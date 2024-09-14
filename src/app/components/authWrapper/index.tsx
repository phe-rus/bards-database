'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useToast } from '@/app/hooks/use-toast';

type LoginWrapperProps = {
    children: React.ReactNode;
};

const LoginWrapper = ({ children }: LoginWrapperProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    useEffect(() => {
        // errors
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: 'destructive', // Or any other variant that you have
            });
        }
    }, [error, toast]);

    const handleRegister = async () => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();
            if (response.ok) {
                toast({
                    title: "Registration successful",
                    description: result.msg || 'User registered successfully',
                });
                setIsRegistering(false); // Switch to login after successful registration
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
            console.error(err);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();
            if (response.ok) {
                toast({
                    title: "Login successful",
                    description: 'Successfully logged in'
                });
                setToken(result.token);
                setError(null);
            } else {
                setError(result.message || 'Login failed');
                setToken(null);
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error(err);
        }
    };

    if (token) {
        return <>{children}</>;
    }

    // If not logged in, render login/register form
    return (
        <section className="flex flex-col max-w-full w-full h-screen justify-center">
            <Card className="mx-auto max-w-sm w-full rounded-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{isRegistering ? 'Register' : 'Login'}</CardTitle>
                    <CardDescription>
                        {isRegistering
                            ? 'Enter your email below to create a new account'
                            : 'Enter your email below to login to your account'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            isRegistering ? handleRegister() : handleLogin();
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                {!isRegistering && (
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            {isRegistering ? 'Register' : 'Login'}
                        </Button>
                        {error && <p className="mt-2 text-red-500">{error}</p>}
                    </form>
                    <div className="mt-4 text-center text-sm">
                        {isRegistering ? (
                            <>
                                Already have an account?{" "}
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="underline"
                                    onClick={() => setIsRegistering(false)}
                                >
                                    Login
                                </Button>
                            </>
                        ) : (
                            <>
                                Don&apos;t have an account?{" "}
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="underline"
                                    onClick={() => setIsRegistering(true)}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default LoginWrapper;