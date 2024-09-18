'use client'

import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"

type ProjectProps = {
    listdatabases: {
        name: string;
        sizeOnDisk: string;   // size in MB
        empty: boolean;
        collectionsCount: number;
        totalDocuments: number;
        avgObjSize: number;
        indexes: number;
    }[];
    // add an onclick listener
    selectedListener: string;
    onSelectListener: (string: string) => void
}
export const Projects = ({ listdatabases, selectedListener, onSelectListener }: ProjectProps) => {
    const [projectName, setProjectName] = useState('')
    const [badgeName, setBadgeName] = useState('')

    const generateUID = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    const projectNameArray = projectName.split('-');
    useEffect(() => {
        if (projectName != '') {
            if (projectNameArray.length > 1) {
                setBadgeName(
                    `${projectNameArray[0]}-${projectNameArray[1].toLowerCase().replace(/[^a-z]/g, '')}`
                );
            } else {
                const randomUID = generateUID(5); // Generate an 5-character random UID
                setBadgeName(`${projectNameArray[0]}-${randomUID}`);
            }
        } else {
            setBadgeName('my-awesome-project-id');
        }
    }, [projectName])

    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold">Current Projects</h2>
            <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}>
                <Sheet>
                    <SheetTrigger asChild>
                        <Card className="rounded-3xl">
                            <CardContent className="flex flex-col items-center justify-center gap-3 p-2 h-full">
                                <div className="flex flex-col items-center justify-center gap-3 h-fit">
                                    <PlusIcon />
                                    <h2>Create Project</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </SheetTrigger>
                    <SheetContent side={'right'} className="flex flex-col gap-10 min-w-full w-full">
                        <SheetHeader>
                            <SheetTitle className={'text-2xl font-bold'}>Create a project</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-5 max-w-2xl mt-20">
                            <h1 className="flex flex-row items-center gap-2 text-4xl font-bold max-w-md">
                                Let's start with a name for your project <QuestionMarkCircledIcon />
                            </h1>

                            <Input
                                placeholder="Enter your project name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="rounded-none text-4xl font-bold py-7 border-t-0 border-r-0 border-l-0 border-b-2"
                            />
                            <Badge variant={'outline'} className="rounded-full w-fit p-2">
                                {badgeName}
                            </Badge>
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-col">
                                    <h2>This creates predefined collections</h2>
                                </div>
                                <Button
                                    size={'lg'}
                                    variant={'ghost'}
                                    className="bg-accent"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                {listdatabases?.map((item, index) => {
                    return (
                        <Card key={index} className={`rounded-3xl cursor-pointer ${selectedListener.includes(item.name) ? 'bg-muted/30' : ''}`}>
                            <CardContent className="flex flex-col gap-3 p-5"
                                onClick={() => onSelectListener(item.name)}>
                                <div className="flex flex-row gap-3 items-center">
                                    <Button
                                        size={'icon'}
                                        variant={'ghost'}
                                        className="rounded-full bg-muted font-bold"
                                    >
                                        {item.collectionsCount}
                                    </Button>
                                    <h1 className={'text-lg font-black'}>{item.name}</h1>
                                </div>
                                <div className="flex flex-row gap-2 mt-10">
                                    <a className="hidden md:flex flex-row gap-2 items-center text-[10px] w-fit">
                                        <span className="flex flex-col bg-accent items-center justify-center size-5 rounded-full font-light">{item.collectionsCount}</span>collections
                                    </a>

                                    <a className="flex flex-row gap-2 items-center text-[10px] w-fit">
                                        <span className="flex flex-col bg-accent items-center justify-center size-5 rounded-full font-light">{item.totalDocuments}</span>documents
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}