'use client';

import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FieldText } from '../compose';
import { toast } from '@/app/hooks/use-toast';
import { jwtDecode } from 'jwt-decode'; // Make sure to install this package

type LoginWrapperProps = {
    children: React.ReactNode;
};

const LoginWrapper = ({ children }: LoginWrapperProps) => {
    const [createAccount, setCreateAccount] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);

    // Helper function to check if a token is expired
    const isTokenExpired = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    };

    // Log the user out if the token is expired
    const handleTokenExpiration = () => {
        if (token && isTokenExpired(token)) {
            localStorage.removeItem('token');
            setToken(null);
            toast({
                title: 'Session expired',
                description: 'Your session has expired. Please log in again.',
            });
        }
    };

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        if (localToken) {
            setToken(localToken);
        }

        // Check token expiration every minute
        const interval = setInterval(() => {
            handleTokenExpiration();
        }, 60000); // 60 seconds

        // Cleanup the interval on unmount
        return () => clearInterval(interval);
    }, [token]);

    const handleLogin = async () => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            setToken(result.token);
            toast({
                title: 'Successfully',
                description: result.msg,
            });
        } else {
            console.error(result.msg);
            toast({
                title: 'Error',
                description: result.msg,
            });
        }
    };

    const handleCreateAccount = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const response = await fetch('/api/auth/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            setCreateAccount(false);
            toast({
                title: 'Successfully',
                description: result.msg,
            });
        } else {
            console.error(result.msg);
            toast({
                title: 'Error',
                description: result.msg,
            });
        }
    };

    if (token) {
        return <>{children}</>;
    } else {
        return (
            <section className="container flex flex-col max-w-full w-full h-screen justify-center">
                <div className="flex flex-col gap-3 mx-auto max-w-sm w-full rounded-sm">
                    <Label className={'text-6xl font-light'}>Bards database</Label>
                    <FieldText
                        label='Email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {!createAccount ? (
                        <FieldText
                            label='Password'
                            type='password'
                            placeholder='******'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    ) : (
                        <div className='flex flex-col gap-1'>
                            <FieldText
                                label='Password'
                                type='password'
                                placeholder='******'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FieldText
                                label='Confirm Password'
                                type='password'
                                placeholder='******'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex w-full max-w-full justify-end">
                        <Button
                            size={'sm'}
                            variant={'link'}
                            onClick={() => setCreateAccount(!createAccount)}
                        >
                            {createAccount ? 'Login' : 'Create Account'}
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-none"
                        onClick={createAccount ? handleCreateAccount : handleLogin}
                    >
                        {createAccount ? 'Sign Up' : 'Login'}
                    </Button>
                </div>
            </section>
        );
    }
};

export default LoginWrapper;
