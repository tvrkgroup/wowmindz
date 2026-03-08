import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { getFooterQuickLinks, isPageVisibleInTemplate } from "@/config/page-registry";
import { templateFooterHours } from "@/content/page-content";

function formatPhoneForHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export default async function Footer() {
  const config = await getSiteConfig();
  const quickLinks = getFooterQuickLinks(config);
  const showFooterCta = isPageVisibleInTemplate(config, "contact");
  const showAddress = Boolean(config.address.trim());
  const showMapLink = Boolean(templateFooterHours.mapLink?.trim());

  return (
    <footer>
      <div className="container">
        <div className="grid grid-3">
          <div className="footer-contact">
            <h4>{config.schoolName}</h4>
            {showAddress ? (
              <>
                <div className="info-row">
                  <span className="icon icon-location" aria-hidden="true" />
                  {showMapLink ? (
                    <a href={templateFooterHours.mapLink} target="_blank" rel="noreferrer">
                      {config.address}
                    </a>
                  ) : (
                    <span>{config.address}</span>
                  )}
                </div>
                <div className="divider" />
              </>
            ) : null}
            <div className="info-row">
              <span className="icon icon-phone" aria-hidden="true" />
              <a href={`tel:${formatPhoneForHref(config.contactPhone)}`}>Phone: {config.contactPhone}</a>
            </div>
            <div className="info-row">
              <span className="icon icon-mail" aria-hidden="true" />
              <a href={`mailto:${config.contactEmail}`}>Email: {config.contactEmail}</a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <div className="divider" />
            {quickLinks.map((item) => (
              <p key={item.key}>
                <Link href={item.href}>{item.label}</Link>
              </p>
            ))}
          </div>
          <div>
            <h4>Working Hours</h4>
            <div className="divider" />
            {templateFooterHours.hours.map((slot) => (
              <p key={slot}>{slot}</p>
            ))}
            {showFooterCta ? (
              <>
                <div className="divider" />
                <Link className="button secondary footer-contact-button" href="/contact">
                  Contact Us
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom">
          <span>{templateFooterHours.copyright || `${config.schoolName} © 2026`}</span>
          <span>
            Designed and developed by{" "}
            <a href="https://wowmindz.com" target="_blank" rel="noreferrer">
              wowmindz.com
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}
