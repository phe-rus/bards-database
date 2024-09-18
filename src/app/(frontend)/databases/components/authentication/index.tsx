'use client'

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { CopyIcon, MailIcon, MoreVerticalIcon, RefreshCw } from "lucide-react";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";

type AuthenticationProps = {
    collections: any[]
}
export const Authentication = ({ collections }: AuthenticationProps) => {
    return (
        <div className="flex flex-col gap-5 mt-10">
            <h2 className="text-3xl font-bold">Authentication</h2>
            <div className="bg-muted/0">
                <div className="flex flex-row gap-3 items-center p-2 bg-muted/55 rounded-t-lg">
                    <Input
                        placeholder="Search by email address, phone number, or user UID"
                        className="rounded-md w-full bg-accent"
                    />
                    <div className="flex flex-row items-center gap-2">
                        <Button
                            variant={'destructive'}
                            size={'sm'}
                            className="rounded-md col-span-2 w-28"
                        >
                            Add user
                        </Button>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className="rounded-full col-span-1"
                        >
                            <RefreshCw size={18} />
                        </Button>
                        <Button
                            size={'icon'}
                            variant={'ghost'}
                            className="rounded-full col-span-1"
                        >
                            <MoreVerticalIcon size={18} />
                        </Button>
                    </div>
                </div>
                <Table className="bg-muted/20 rounded-b-lg">
                    <TableCaption className="p-5">A list of authenticated users.</TableCaption>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="w-[150px]">Identifier</TableHead>
                            <TableHead className="w-[65px]">Providers</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Signed In</TableHead>
                            <TableHead className="text-start">User UID</TableHead>
                            <TableHead className="w-5"></TableHead>
                            <TableHead className="w-5"></TableHead>
                        </TableRow>
                    </TableHeader>

                    {collections?.filter(e => 'users' == e.collectionName).map((item, index) => {
                        return (
                            <TableBody key={item}>
                                {item.documents?.map((items: { createdAt: string | number | Date; updatedAt: string | number | Date; email: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; _id: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, indexs: Key | null | undefined) => {
                                    const options: Intl.DateTimeFormatOptions = {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    };

                                    const createdAt = new Date(items.createdAt).toLocaleString('en-US', options);
                                    const updatedAt = new Date(items.updatedAt).toLocaleString('en-US', options);
                                    return (
                                        <TableRow key={indexs}>
                                            <TableCell className="font-medium">{items.email}</TableCell>
                                            <TableCell><MailIcon /></TableCell>
                                            <TableCell className="overflow-hidden truncate">{createdAt}</TableCell>
                                            <TableCell className="overflow-hidden truncate">{updatedAt}</TableCell>
                                            <TableCell className="text-start overflow-hidden truncate">{items._id}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size={'icon'}
                                                    variant={'ghost'}
                                                    className="rounded-full"
                                                >
                                                    <CopyIcon size={18} />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size={'icon'}
                                                    variant={'ghost'}
                                                    className="rounded-full"
                                                >
                                                    <MoreVerticalIcon size={18} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )

                                })}
                            </TableBody>
                        )
                    })}
                </Table>
            </div>
        </div>
    )
}