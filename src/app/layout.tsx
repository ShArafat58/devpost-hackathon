import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
    Fraunces,
    IBM_Plex_Mono,
    IBM_Plex_Sans,
    Noto_Sans_Bengali,
} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
});

const plexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-plex-sans",
    display: "swap",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-plex-mono",
    display: "swap",
});

// Fallback so Bengali job posts render cleanly in sans and mono text
const bengali = Noto_Sans_Bengali({
    subsets: ["bengali"],
    weight: ["400", "600"],
    variable: "--font-bengali",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Ghostlisted — Is anyone really hiring?",
    description:
        "Check a job post for scam, ghost-job, and fresher-mismatch signals before you apply.",
};

export const viewport: Viewport = {
    themeColor: "#f4f1ea",
};

export default function RootLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <html
            lang="en"
            className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} ${bengali.variable}`}
        >
            <body className="min-h-dvh antialiased">{children}</body>
        </html>
    );
}