'use client'

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { ChevronRight, ChevronDown, Trash2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const CollapsibleJsonView = ({ data }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const renderValue = (value: unknown) => {
        if (typeof value === 'object' && value !== null) {
            return <CollapsibleJsonView data={value} />;
        }
        return (
            <Input
                value={JSON.stringify(value)}
                className={`text-sm font-light text-green-600 dark:text-green-300 rounded-none h-6 w-fit`}
            />
        )
    };

    return (
        <div className="pl-4 w-fit">
            <div onClick={toggleCollapse} className="cursor-pointer flex w-fit items-center">
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                {Array.isArray(data) ? (
                    <span className="text-yellow-500">Array[{data.length}]</span>
                ) : (
                    <span className="text-yellow-500">Object</span>
                )}
            </div>
            {!isCollapsed && (
                <div className="pl-3 w-fit">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex items-start border-l-2 h-fit justify-center top-0 w-fit max-w-fit min-w-fit">
                            <div className='flex flex-row items-center'>
                                <span className='bg-accent h-[1px] w-5 rounded-full' />
                                <Button
                                    variant={'link'}
                                    size={'sm'}
                                    className="flex flex-row text-blue-500 p-2 w-fit"
                                >
                                    {key}
                                </Button>
                            </div>
                            <span className="text-blue-500 mr-2 ml-2">:</span>
                            {renderValue(value)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RealtimeDatabaseUI = ({ collections }: any) => {
    const [selected, setSelected] = useState('');

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg border md:min-w-full w-full"
        >
            <ResizablePanel minSize={5} maxSize={35} defaultSize={30} className='min-h-screen'>
                <h1 className='text-2xl font-bold p-5'>Collections</h1>
                <div className="flex flex-col items-start justify-center px-5 mb-5">
                    {collections?.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => setSelected(item.collectionName)}
                            className='hover:border-[1px] p-[3px] rounded-md hover:cursor-pointer'
                        >
                            {item.collectionName}
                        </span>
                    ))}
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel maxSize={8} minSize={8} defaultSize={8}>
                        <div className="flex flex-row h-full items-center justify-between p-6">
                            <h1 className="font-semibold">{selected}</h1>

                            <Button
                                size={'icon'}
                                variant={'ghost'}
                                className='bg-muted rounded-full size-6'
                            >
                                <Trash2Icon size={13} strokeWidth={3} />
                            </Button>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={100}>
                        <ScrollArea className="h-full w-full rounded-none p-2">
                            {collections?.filter((e: { collectionName: string; }) => e.collectionName === selected)?.map((item, index) => (
                                <div key={index} className="grid gap-1">
                                    {item.documents?.map((doc, idx) => (
                                        <Card key={idx} className='rounded-sm max-w-full w-full'>
                                            <CardContent className='flex flex-row p-1 w-fit'>
                                                <CollapsibleJsonView data={doc} />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ))}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default RealtimeDatabaseUI;