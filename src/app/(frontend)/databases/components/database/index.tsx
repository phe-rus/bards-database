import RealtimeDatabaseUI from "@/app/components/editors"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

type AuthenticationProps = {
    collections: any[]
}
export const Database = ({ collections }: AuthenticationProps) => {
    return (
        <div className="flex flex-col gap-5 mt-10 max-w-full min-w-full">
            <h2 className="text-3xl font-bold">Database</h2>

            <Tabs defaultValue="data" className="w-full">
                <TabsList>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="backups">Backups</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                <TabsContent value="data" className="flex flex-col max-w-full w-full">
                    <RealtimeDatabaseUI collections={collections} />
                </TabsContent>
                <TabsContent value="rules">Change your password here.</TabsContent>
                <TabsContent value="backups">Change your password here.</TabsContent>
                <TabsContent value="usage">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}