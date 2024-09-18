"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"

export function Themer() {
    const { setTheme, theme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-accent size-9 md:size-8"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}