import { LegalPage } from "@/components/legal";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="3 July 2026"
      intro="By using Atelo you agree to these terms. They are meant to be fair, readable, and free of surprises."
      sections={[
        {
          heading: "The service",
          body: [
            "Atelo lets designers collect client finish preferences through a shared link and turns them into a report. Atelo is actively developed, so features may change and improve over time.",
          ],
        },
        {
          heading: "Your account",
          body: [
            "You are responsible for your account, the content you upload, and keeping your password secure. You must hold the rights to any images or materials you add to a board.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "Do not use Atelo to upload unlawful content, infringe anyone's rights, or attempt to disrupt, overload, or reverse-engineer the service.",
          ],
        },
        {
          heading: "Boards and credits",
          body: [
            "Your first board is free. Additional boards are available as one-off credits or a subscription, as shown on the pricing page. Credits do not expire. Paid amounts are non-refundable except where required by law.",
          ],
        },
        {
          heading: "Your content",
          body: [
            "You own your content and your clients' responses. You grant Atelo only the limited licence needed to store and process them so the product can function on your behalf.",
          ],
        },
        {
          heading: "Availability",
          body: [
            "Atelo is provided on an as-is basis. As an actively developed product it may change or experience downtime, and we do not guarantee uninterrupted service.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "To the fullest extent permitted by law, Atelo is not liable for indirect or consequential losses arising from use of the service. Nothing here limits liability that cannot be limited by law.",
          ],
        },
        {
          heading: "Termination",
          body: [
            "You can stop using Atelo and delete your data at any time. We may suspend or close accounts that breach these terms.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "We may update these terms as the product evolves; material changes are reflected by the last-updated date above.",
          ],
        },
      ]}
    />
  );
}
