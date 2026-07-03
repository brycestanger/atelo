import { LegalPage } from "@/components/legal";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      updated="3 July 2026"
      intro="Security matters even at this stage. Here is how your data — and your clients' — is protected."
      sections={[
        {
          heading: "Infrastructure",
          body: [
            "Atelo runs on Supabase (managed Postgres and Storage) with modern hosting. All data is encrypted in transit using HTTPS/TLS.",
          ],
        },
        {
          heading: "Access control",
          body: [
            "Every board is protected by Postgres row-level security, so a studio can only ever read or write its own data. Privileged operations use scoped service credentials that are never exposed to the browser.",
          ],
        },
        {
          heading: "Authentication",
          body: [
            "Accounts use email and password. Passwords are hashed and never stored in plain text. Client swipe links require no account and never expose your dashboard or other boards.",
          ],
        },
        {
          heading: "Data minimalism",
          body: [
            "We collect only what the product needs to work. Client responses are anonymous. API keys and secrets are kept server-side and out of version control.",
          ],
        },
        {
          heading: "Responsible disclosure",
          body: [
            "Found a vulnerability? Please email bandrewstanger@gmail.com before disclosing it publicly, and we will work with you to fix it quickly.",
          ],
        },
      ]}
    />
  );
}
