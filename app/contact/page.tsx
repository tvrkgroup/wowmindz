import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { templatePageHeroes, contactPageContent } from "@/content/page-content";
import { getSiteConfig } from "@/lib/site-config";

function formatPhoneForHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export default async function ContactPage() {
  await enforcePageVisibility("contact");
  const hero = templatePageHeroes.contact!;
  const config = await getSiteConfig();
  const showAddress = Boolean(config.address.trim());
  const showMapLink = Boolean(contactPageContent.mapLink.trim());
  const showMapEmbed = Boolean(contactPageContent.mapEmbedUrl.trim());
  return (
    <div>
      <Nav />
      <PageHero
        title={hero.title}
        eyebrow={hero.eyebrow}
        description={hero.description}
      />
      <section className="section section-pattern">
        <div className="container grid grid-2">
          <div className="card info-card contact-office-card">
            <h3 className="contact-panel-title">{contactPageContent.officeTitle}</h3>
            <p className="contact-panel-subtitle">{contactPageContent.officeSubtitle}</p>
            {showAddress ? (
              <>
                <div className="info-row">
                  <span className="icon icon-location" aria-hidden="true" />
                  {showMapLink ? (
                    <a href={contactPageContent.mapLink} target="_blank" rel="noreferrer">
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
            <div className="divider" />
            <h3 className="contact-panel-title">{contactPageContent.visitHoursTitle}</h3>
            <p className="contact-panel-subtitle">{contactPageContent.visitHoursSubtitle}</p>
            {contactPageContent.visitHours.map((slot) => (
              <p key={slot}>{slot}</p>
            ))}
            {showMapEmbed ? (
              <div className="contact-map-wrap">
                <iframe
                  src={contactPageContent.mapEmbedUrl}
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location Map"
                />
              </div>
            ) : null}
          </div>
          <div className="card info-card contact-form-card">
            <h3 className="contact-panel-title">{contactPageContent.formTitle}</h3>
            <p className="contact-panel-subtitle">{contactPageContent.formSubtitle}</p>
            <InquiryForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
