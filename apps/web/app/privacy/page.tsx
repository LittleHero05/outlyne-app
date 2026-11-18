import type { Metadata } from "next";
import { SITE } from "@outlyne/core";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy — Outlyne",
  description: "What Outlyne collects, why, and how to delete it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="November 18, 2026">
      <p>
        Outlyne makes shareable cards from things you did. We collect as little as we can to
        do that, and we never sell your data or show you ads.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your email address</strong>, if you join our updates list or sign in. Signing
          in uses a one-time code sent to that address. There are no passwords.
        </li>
        <li>
          <strong>Cards you choose to save</strong>: the details you typed (like a book title or
          workout), the color you picked, and the date you saved it.
        </li>
        <li>
          <strong>Photos you save with a card.</strong> They are stored privately and only you
          can see them.
        </li>
      </ul>
      <p>
        Cards you make without saving never leave your device. Photos you pick are not
        uploaded unless you save the card.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To sign you in and keep your saved cards and photos.</li>
        <li>
          To email you about new activities and features, only if you joined the updates list.
          You can ask us to remove you at any time.
        </li>
      </ul>

      <h2>Who helps us run Outlyne</h2>
      <ul>
        <li>Supabase stores accounts, saved cards and photos.</li>
        <li>Resend sends our emails, including sign-in codes.</li>
        <li>Vercel hosts this website.</li>
      </ul>
      <p>They process data only to provide these services to us.</p>

      <h2>Deleting your data</h2>
      <p>
        You can delete any saved card, or your whole account, from My cards. Deleting your
        account permanently removes your email, cards and photos. To be removed from the
        updates list, email us.
      </p>

      <h2>Children</h2>
      <p>Outlyne is not directed at children under 13.</p>

      <h2>Contact</h2>
      <p>
        Questions or requests: <a className="font-medium text-outlyne-maroon underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
