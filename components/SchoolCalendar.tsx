"use client";

import { useMemo, useState } from "react";
import type { SiteEvent } from "@/lib/site-config-schema";
import { sortEventsAsc, toEventDate, toIsoDay } from "@/lib/events";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function SchoolCalendar({ events }: { events: SiteEvent[] }) {
  const sortedEvents = useMemo(() => sortEventsAsc(events), [events]);
  const now = new Date();
  const currentYear = now.getFullYear();
  const years = useMemo(
    () => Array.from({ length: 15 }).map((_, index) => currentYear - 6 + index),
    [currentYear]
  );
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedIso, setSelectedIso] = useState(toIsoDay(now));
  const [showAllEvents, setShowAllEvents] = useState(false);

  const eventMap = useMemo(() => {
    const map = new Map<string, SiteEvent[]>();
    for (const event of sortedEvents) {
      const date = toEventDate(event);
      if (!date) continue;
      const key = toIsoDay(date);
      map.set(key, [...(map.get(key) || []), event]);
    }
    return map;
  }, [sortedEvents]);

  const firstDay = new Date(year, month, 1);
  const leadBlanks = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedEvents = eventMap.get(selectedIso) || [];
  const upcomingEvents = sortedEvents.filter((event) => {
    const date = toEventDate(event);
    if (!date) return false;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return date.getTime() >= startOfToday.getTime();
  });
  const nextEvent = upcomingEvents[0] || null;
  const monthEvents = sortedEvents.filter((event) => {
    const date = toEventDate(event);
    return date && date.getMonth() === month && date.getFullYear() === year;
  });

  const jumpToEvent = (event: SiteEvent) => {
    const date = toEventDate(event);
    if (!date) return;
    setYear(date.getFullYear());
    setMonth(date.getMonth());
    setSelectedIso(toIsoDay(date));
  };

  const stepMonth = (delta: number) => {
    const candidate = new Date(year, month + delta, 1);
    setYear(candidate.getFullYear());
    setMonth(candidate.getMonth());
  };

  return (
    <div className="calendar-layout">
      <article className="card school-calendar-card">
        <div className="school-calendar-controls">
          <button type="button" className="button secondary" onClick={() => stepMonth(-1)}>
            Prev
          </button>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Select month">
            {MONTHS.map((item, index) => (
              <option key={item} value={index}>
                {item}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Select year">
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="button" className="button secondary" onClick={() => stepMonth(1)}>
            Next
          </button>
        </div>

        <div className="school-calendar-grid school-calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="school-calendar-grid school-calendar-days">
          {Array.from({ length: leadBlanks }).map((_, index) => (
            <span key={`blank-${index}`} className="school-calendar-day empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateObj = new Date(year, month, day);
            const iso = toIsoDay(dateObj);
            const items = eventMap.get(iso) || [];
            const active = selectedIso === iso;
            return (
              <button
                type="button"
                key={iso}
                className={`school-calendar-day ${items.length ? "has-event" : ""} ${active ? "is-selected" : ""}`}
                onClick={() => setSelectedIso(iso)}
              >
                <strong>{day}</strong>
                {items.length ? <small>{items.length} event</small> : null}
              </button>
            );
          })}
        </div>
      </article>

      <article className="card school-calendar-events">
        <h3>Event Details</h3>
        <p className="school-calendar-selected-date">
          {new Date(selectedIso).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
        </p>
        <div className="divider" />

        <div className="school-calendar-event-list">
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <div className="school-calendar-event-item" key={event.id}>
                <p className="school-calendar-event-date">
                  {new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
                <h4>{event.title}</h4>
                <p>
                  <strong>{event.category}</strong> · {event.location}
                </p>
                <p>{event.shortDescription}</p>
                {event.image ? <img src={event.image} alt={event.title} className="school-calendar-event-image" /> : null}
                {event.description ? <p>{event.description}</p> : null}
              </div>
            ))
          ) : (
            <p className="admin-help">No events on this date.</p>
          )}
        </div>

        <div className="divider" />
        <h4>Next Event</h4>
        {nextEvent ? (
          <button type="button" className="school-calendar-month-item" onClick={() => jumpToEvent(nextEvent)}>
            <span>
              {new Date(nextEvent.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <strong>{nextEvent.title}</strong>
          </button>
        ) : (
          <p className="admin-help">No upcoming events.</p>
        )}

        <div className="school-calendar-view-all">
          <button type="button" className="button secondary" onClick={() => setShowAllEvents((prev) => !prev)}>
            {showAllEvents ? "Hide All Events" : "View All Events"}
          </button>
        </div>

        {showAllEvents ? (
          <div className="school-calendar-month-list">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <button type="button" className="school-calendar-month-item" key={`all-${event.id}`} onClick={() => jumpToEvent(event)}>
                  <span>
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <strong>{event.title}</strong>
                </button>
              ))
            ) : (
              <p className="admin-help">No events.</p>
            )}
          </div>
        ) : null}

        <div className="divider" />
        <h4>This Month</h4>
        <div className="school-calendar-month-list">
          {monthEvents.length > 0 ? (
            monthEvents.map((event) => (
              <button type="button" className="school-calendar-month-item" key={event.id} onClick={() => jumpToEvent(event)}>
                <span>
                  {new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </span>
                <strong>{event.title}</strong>
              </button>
            ))
          ) : (
            <p className="admin-help">No events in selected month.</p>
          )}
        </div>
      </article>
    </div>
  );
}
