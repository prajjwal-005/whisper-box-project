"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
      toastOptions={{
  classNames: {
    toast: "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-md group-[.toaster]:border-border/40 group-[.toaster]:shadow-2xl",
    success: "group-[.toast]:border-l-green-500",
    error: "group-[.toast]:border-l-destructive",
    info: "group-[.toast]:border-l-blue-500",
       }
    }}
    />
  )
}

export { Toaster }
