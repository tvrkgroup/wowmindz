import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="grid grid-3">
          <div className="footer-contact">
            <h4>The Silver Brook Public School</h4>
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
          <div>
            <h4>Quick Links</h4>
            <div className="divider" />
            <p>
              <Link href="/admissions">Admissions</Link>
            </p>
            <p>
              <Link href="/academics">Academics</Link>
            </p>
            <p>
              <Link href="/campus">Campus & Facilities</Link>
            </p>
            <p>
              <Link href="/news">News & Events</Link>
            </p>
          </div>
          <div>
            <h4>School Hours</h4>
            <div className="divider" />
            <p>Mon - Fri: 8:30 AM - 4:00 PM</p>
            <p>Sat: 9:00 AM - 1:00 PM</p>
            <p>Sun: Closed</p>
            <div className="divider" />
            <Link className="button secondary" href="/contact">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="divider" />
        <div className="footer-bottom">
          <span>© 2026 The Silver Brook Public School. All rights reserved.</span>
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
