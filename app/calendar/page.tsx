import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import PageHero from "../../components/PageHero";
import { getSiteConfig } from "@/lib/site-config";
import { enforcePageVisibility } from "@/lib/page-visibility";
import { isEventVisible } from "@/lib/events";
import SchoolCalendar from "@/components/SchoolCalendar";

export default async function CalendarPage() {
  await enforcePageVisibility("calendar");
  const config = await getSiteConfig();
  const visibleEvents = config.events.filter(isEventVisible);

  return (
    <div>
      <Nav />
      <PageHero
        title="School Calendar"
        eyebrow="Plan Ahead"
        description="Navigate by month and year, select any date, and view detailed events."
      />
      <section className="section">
        <div className="container">
          <SchoolCalendar events={visibleEvents} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
