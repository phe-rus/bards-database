'use client'

import { Themer } from "@/app/components/themes/themer";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import { toast } from "@/app/hooks/use-toast";
import { ImageIcon, LucideDatabaseZap, Users2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Authentication } from "./components/authentication";
import { Projects } from "./components/projects";
import { useSearchParams } from "next/navigation";
import { Database } from "./components/database";
import { Profiles } from "./components/profiles";

export default function Dashboard() {
    const [selectedDatabase, setSelectedDatabase] = useState('')
    const [documentFilter, setDocumentFilter] = useState('')
    const [listdatabases, setDatabases] = useState<{
        name: string;
        sizeOnDisk: string;   // size in MB
        empty: boolean;
        collectionsCount: number;
        totalDocuments: number;
        avgObjSize: number;
        indexes: number;
    }[]>();

    const [profile, setProfile] = useState<any>()
    const [collections, setCollections] = useState<any[]>()
    const searchParams = useSearchParams()
    const params = searchParams.get('bards')

    useEffect(() => {
        handleProfile()
        handledatabaseList()
        if (localStorage.getItem('project')) {
            const project = localStorage.getItem('project')!
            setSelectedDatabase(project)
        }
        if (selectedDatabase) {
            handleCollections(selectedDatabase)
        } else {
            handleCollections(localStorage.getItem('project')!)
        }
    }, [])

    const handleParams = (params: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('bards', params);
        window.history.pushState({}, '', url.toString());
    };

    const handledatabaseList = async () => {
        const mongoUrl = localStorage.getItem('mongoUrl');

        const response = await fetch(`/api/dbs/listdatabases?mongoUrl=${mongoUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json();
        if (response.ok) {
            console.log(result);
            setDatabases(result)
        } else {
            toast({
                title: 'Error',
                description: result.msg
            });
        }
    };

    const handleCollections = async (database: string) => {
        const mongoUrl = localStorage.getItem('mongoUrl');
        const response = await fetch(`/api/dbs/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mongoUrl: mongoUrl,
                database: database
            })
        });
        const result = await response.json();
        if (response.ok) {
            setCollections(result)
        } else {
            toast({
                title: 'Error',
                description: result.msg
            });
        }
    };

    const handleProfile = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const result = await response.json();
        if (response.ok) {
            setProfile(result)
        } else {
            toast({
                title: 'Error',
                description: result.msg
            });
        }
    };

    return (
        <section className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                    <Link
                        href="/databases"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-[#00000030] text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Image
                            alt="bards database"
                            width={1000}
                            height={1000}
                            src={'/bards-database.png'}
                            className="h-7 w-7"
                        />
                        <span className="sr-only">Acme Inc</span>
                    </Link>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={'icon'}
                                    variant={'ghost'}
                                    onClick={() => handleParams('authentication')}
                                    className="rounded-full bg-muted/50"
                                >
                                    <Users2Icon strokeWidth={3} className="h-4 w-4" />
                                    <span className="sr-only">Authentication</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Authentication</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={'icon'}
                                    variant={'ghost'}
                                    onClick={() => handleParams('database')}
                                    className="rounded-full bg-muted/50"
                                >
                                    <LucideDatabaseZap strokeWidth={3} className="h-4 w-4" />
                                    <span className="sr-only">Database</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Database</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={'icon'}
                                    variant={'ghost'}
                                    onClick={() => handleParams('storage')}
                                    className="rounded-full bg-muted/50"
                                >
                                    <ImageIcon strokeWidth={3} className="h-4 w-4" />
                                    <span className="sr-only">Storage</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Storage</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>

                <nav className="mt-auto flex flex-col items-center gap-3 px-2 sm:py-4">
                    <Themer />
                    <Avatar className="size-9 md:size-8 hover:cursor-pointer"
                        onClick={() => handleParams('profile')}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </nav>
            </aside>

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">

                </header>

                <main className="container flex-1 md:px-28 lg:px-32 xl:px-60 max-w-full w-full max-h-full min-h-screen">
                    <div className="hidden flex-col gap-5 mt-10">
                        <h2 className="text-3xl font-bold">Database</h2>
                        <div className="mx-auto grid max-w-full w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                            <nav
                                className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                            >
                                {collections?.map((item, index) => {
                                    return (
                                        <Button
                                            size={'sm'}
                                            variant={'link'}
                                            onClick={() => setDocumentFilter(item.collectionName)}
                                            key={index} className="flex flex-row justify-start text-start font-semibold text-primary"
                                        >
                                            {item.collectionName}
                                        </Button>
                                    )
                                })}
                            </nav>

                            {collections?.filter(e => documentFilter == e.collectionName).map((item, index) => {
                                return (
                                    <div key={index} className="grid gap-6">
                                        {item.documents?.map((items, indexs) => {
                                            return (
                                                <Card key={indexs} x-chunk="dashboard-04-chunk-1">
                                                    <CardContent className="p-5">
                                                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(items, null, 2)}</pre>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {params?.includes('authentication') ? (
                        <Authentication collections={collections} />
                    ) : params?.includes('database') ? (
                        <Database collections={collections} />
                    ) : params?.includes('storage') ? (
                        <></>
                    ) : params?.includes('profile') ? (
                        <Profiles profile={profile} refreshApi={handleProfile} />
                    ) : (
                        <Projects
                            listdatabases={listdatabases}
                            selectedListener={selectedDatabase}
                            onSelectListener={(e) => {
                                localStorage.setItem('project', e)
                                setSelectedDatabase(e)
                                handleCollections(e)
                            }}
                        />
                    )}
                </main>
            </div>
        </section>
    )
}