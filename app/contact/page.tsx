import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { enforcePageVisibility } from "@/lib/page-visibility";

export default async function ContactPage() {
  await enforcePageVisibility("contact");
  return (
    <div>
      <Nav />
      <PageHero
        title="Contact Us"
        eyebrow="We are here to help"
        description="Reach out for admissions, transport, or general enquiries."
      />
      <section className="section section-pattern">
        <div className="container grid grid-2">
          <div className="card info-card contact-office-card">
            <h3 className="contact-panel-title">School Office</h3>
            <p className="contact-panel-subtitle">Visit the campus or connect with us directly.</p>
            <div className="info-row">
              <span className="icon icon-location" aria-hidden="true" />
              <a
                href="https://www.google.com/maps/place/Kuthirai+Vandi+Theru,+Gobichettipalayam,+Tamil+Nadu+638476/@11.4549658,77.4262199,3868m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba93d97aa5c5915:0x255ab43b25c6212b!8m2!3d11.4549451!4d77.4365196!16zL20vMDRqNXN3?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
              >
                Pillaiyar Kovil Street, Near Astalakshmi Temple, Karatoor,
                Gobichettipalayam, Erode district - 638476.
              </a>
            </div>
            <div className="divider" />
            <div className="info-row">
              <span className="icon icon-phone" aria-hidden="true" />
              <a href="tel:+919944055929">Phone: +91 99440 55929</a>
            </div>
            <div className="info-row">
              <span className="icon icon-mail" aria-hidden="true" />
              <a href="mailto:thesilverbrookpublicschool@gmail.com">
                Email: thesilverbrookpublicschool@gmail.com
              </a>
            </div>
            <div className="contact-map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17535.457097967566!2d77.43651960000001!3d11.454944900000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba93d97aa5c5915%3A0x255ab43b25c6212b!2sKuthirai%20Vandi%20Theru%2C%20Gobichettipalayam%2C%20Tamil%20Nadu%20638476!5e1!3m2!1sen!2sin!4v1772831969374!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
              />
            </div>
          </div>
          <div className="card info-card">
            <h3 className="contact-panel-title">Visit Hours</h3>
            <p className="contact-panel-subtitle">Office hours for campus visits and admissions support.</p>
            <p>Monday to Friday: 8:30 AM - 4:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
            <div className="divider" />
            <h3 className="contact-panel-title">Feedback / Inquiry Form</h3>
            <p className="contact-panel-subtitle">Share your questions and we will get back quickly.</p>
            <InquiryForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
