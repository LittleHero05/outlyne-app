import type { Metadata } from "next";
import { FREE_CARD_LIMIT, SITE } from "@outlyne/core";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms — Outlyne",
  description: "The terms for using Outlyne.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="November 18, 2026">
      <p>By using Outlyne you agree to these terms. They are short on purpose.</p>

      <h2>Your content</h2>
      <p>
        What you type and the photos you add stay yours. You let us store them only so we can
        show your saved cards back to you. Only add photos you have the right to use, and
        nothing illegal or hurtful.
      </p>

      <h2>Accounts</h2>
      <p>
        You need an email address to save cards. Keep access to that inbox, since we sign you
        in with a code sent there. Free accounts can save up to {FREE_CARD_LIMIT} cards.
      </p>

      <h2>The service</h2>
      <p>
        Outlyne is provided as is. We work hard to keep it running and your cards safe, but we
        can&apos;t promise it will always be available or error free. We may change or end
        features, and we&apos;ll update these terms when we do.
      </p>

      <h2>Ending your account</h2>
      <p>
        You can delete your account from My cards at any time. We may remove accounts that
        break these terms.
      </p>

      <h2>Contact</h2>
      <p>
        <a className="font-medium text-outlyne-maroon underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>
    </LegalPage>
  );
}
