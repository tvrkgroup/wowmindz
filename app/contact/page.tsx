import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";

export default function ContactPage() {
  return (
    <div>
      <Nav />
      <PageHero
        title="Contact Us"
        eyebrow="We are here to help"
        description="Reach out for admissions, transport, or general enquiries."
      />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <h3>School Office</h3>
            <div className="info-row">
              <span className="icon" aria-hidden="true">
                📍
              </span>
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
              <span className="icon" aria-hidden="true">
                📞
              </span>
              <a href="tel:+919944055929">Phone: +91 99440 55929</a>
            </div>
            <div className="info-row">
              <span className="icon" aria-hidden="true">
                ✉️
              </span>
              <a href="mailto:thesilverbrookpublicschool@gmail.com">
                Email: thesilverbrookpublicschool@gmail.com
              </a>
            </div>
          </div>
          <div className="card">
            <h3>Visit Hours</h3>
            <p>Monday to Friday: 8:30 AM - 4:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
