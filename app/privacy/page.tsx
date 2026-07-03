import { LegalPage } from "@/components/legal";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="3 July 2026"
      intro="Atelo is built by an independent developer. This policy explains what we collect, why, and the control you have over it — in plain language, with no dark patterns."
      sections={[
        {
          heading: "What we collect",
          body: [
            "Account details: your email address and an encrypted password.",
            "Project content: the categories, images, and options you upload for a board.",
            "Client responses: the swipes, pins, and showdown results your clients submit. Clients never need an account and are not asked for personal details.",
            "The minimum usage data needed to keep the service running.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "To create your account, generate finish reports, and keep the product working. That is the whole list.",
            "We do not sell your data or your clients' data, and we never use it for advertising.",
          ],
        },
        {
          heading: "Where it is stored",
          body: [
            "Data lives with Supabase (managed Postgres and Storage) and is protected by row-level security, so each studio can only reach its own boards. All traffic is encrypted in transit over HTTPS.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use a small number of essential cookies to keep you signed in. No third-party advertising or tracking cookies.",
          ],
        },
        {
          heading: "Sharing",
          body: [
            "The only people who see a board are you and the client you send the link to. We share data with infrastructure providers (such as Supabase and our host) solely to operate the service — never for their own purposes.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can access, correct, export, or delete your data at any time — email us and we will action it. Deleting a board removes its content and its client responses.",
          ],
        },
        {
          heading: "Retention",
          body: [
            "We keep your data while your account is active. When you delete a board or your account, the associated data is removed from our systems.",
          ],
        },
      ]}
    />
  );
}
