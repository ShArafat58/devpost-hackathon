import type { Context } from "@/shared/schema";

export interface SamplePost {
    id: "scam" | "ghost" | "mismatch";
    title: string;
    company: string;
    kindLabel: string;
    context: Context;
    text: string;
}

// All companies and posts below are fictional, written for the demo.
export const SAMPLE_POSTS: SamplePost[] = [
    {
        id: "scam",
        title: "Remote Data Entry Associate",
        company: "Tessarine Global Services",
        kindLabel: "Scam-like",
        context: { source: "whatsapp_telegram", age: "under_1_week", reposted: "not_sure" },
        text: `URGENT HIRING – Remote Data Entry Associate (Freshers Welcome)
Tessarine Global Services is hiring 20 candidates immediately. No interview required — selection is based on your form only.

Salary: USD 900 per week, paid every Friday.
Work from home, only 2 hours a day.

To confirm your seat, pay a refundable onboarding and training fee of USD 35 within 24 hours.
After payment, send a photo of your national ID card, your bank account details, and a selfie for verification.

For fast processing, contact our hiring desk on Telegram only. Do not call the office.
Seats are filling fast. Offer valid today only.`,
    },
    {
        id: "ghost",
        title: "Software Engineer – All Levels",
        company: "Halvern Arc Technologies",
        kindLabel: "Ghost-like",
        context: { source: "linkedin", age: "over_3_months", reposted: "yes" },
        text: `Software Engineer – All Levels (Multiple Openings)
Halvern Arc Technologies
Location: Flexible / Multiple locations

We are always looking for passionate, talented people to join our growing family.
This posting is used to build our talent community for current and future opportunities.

Responsibilities: Work on exciting projects with modern technologies. Collaborate with cross-functional teams.
Requirements: Strong problem-solving skills. Good communication. Passion for technology.

Salary: Competitive.
Application deadline: Open until filled.

Even if you have applied before, feel free to apply again. Our recruitment team will reach out if there is a match.`,
    },
    {
        id: "mismatch",
        title: "Graduate Trainee Engineer (Fresher)",
        company: "Corvane Systems Ltd.",
        kindLabel: "Fresher-mismatch",
        context: { source: "job_board", age: "1_4_weeks", reposted: "no" },
        text: `Graduate Trainee Engineer (Fresher) — 5 Positions
Corvane Systems Ltd.

Fresh graduates are encouraged to apply for our 2026 Graduate Trainee Program.
Number of vacancies: 05
Application deadline: 31 October 2026

Requirements:
- B.Sc. in CSE/EEE or a related field
- Minimum 3 years of professional experience building production systems
- Must have led a team of at least 3 engineers
- Hands-on ownership of cloud infrastructure and on-call rotations

Salary: Negotiable, based on experience.
Only shortlisted candidates will be contacted.`,
    },
];