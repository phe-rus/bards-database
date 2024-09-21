'use client'

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"

type ProfileProps = {
    profile: any;
    refreshApi?: () => void;
}
export const Profiles = ({ profile, refreshApi }: ProfileProps) => {
    const handleUpdates = async (key: string, value: string) => {
        const token = localStorage.getItem('token');
        await fetch('/api/auth/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                key: key,
                value: value
            })
        });
        refreshApi?.();
    }

    return (
        <section className="flex flex-1 flex-col gap-4">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">Profile</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <nav
                    className="grid gap-4 items-center justify-start text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                >
                    <Button
                        size={'sm'}
                        variant={'link'}
                        className="font-semibold text-primary text-start"
                    >
                        General
                    </Button>
                </nav>
                <div className="grid gap-6">
                    <Card x-chunk="dashboard-04-chunk-1" className="rounded-sm">
                        <CardHeader>
                            <CardTitle>Profile details</CardTitle>
                            <Avatar className="size-20">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Input
                                type="file"
                                onChange={() => { }}
                                className="w-fit items-center"
                            />

                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Input
                                placeholder="User name"
                                value={profile?.name}
                                onChange={(e) => handleUpdates('name', e.target.value)}
                            />
                            <Input
                                placeholder="Email Address"
                                value={profile?.email}
                                onChange={(e) => handleUpdates('email', e.target.value)}
                            />
                            <Textarea
                                placeholder="User name"
                                value={profile?.bio}
                                onChange={(e) => handleUpdates('bio', e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}