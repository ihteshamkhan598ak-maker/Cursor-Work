# Doctor Portal Design System

## Product structure

The doctor owns the profile, patients, appointments, and reviews; clinics are time-bound affiliations that can be current, past, or primary.

## Visual system

- Primary: deep teal `#0F766E`, with `#115E59` for pressed and hover states.
- Neutrals: slate `50–950` for backgrounds, borders, body text, and headings.
- Status colors: amber for waiting, emerald for confirmed, red for cancelled, and blue for information.
- Font: Inter only, so every screen remains readable and visually consistent.
- Spacing: an 8px scale using 8, 16, 24, 32, 40, and 48 pixels, with 4px only for very small internal gaps.
- Icons: one outline SVG style at 20 or 24 pixels with rounded strokes.

## Shared components

- Buttons are at least 48px high, use a 12px corner radius, and have clear primary, secondary, and quiet styles.
- Cards use white backgrounds, slate borders, a 16px radius, and very light shadows.
- Page headers are left aligned and always contain a short explanation beneath the title.
- Status badges use both words and color, so meaning is never shown by color alone.
- Forms keep labels above inputs and show help or error text directly below the relevant field.
- Mobile navigation is fixed at the bottom with large thumb-friendly targets; desktop navigation uses a left sidebar.

## Screens

1. Profile — identity, verification, rating, fee, availability, and a public-profile preview.
2. My clinics — current and past affiliations, primary clinic controls, and join/leave actions.
3. Availability — weekly hours, appointment duration, slot capacity, and leave days.
4. Appointments — today, upcoming, and past visits with patient, clinic, time, and status.
5. Patients — searchable patient list with visit history and private notes.
6. Reviews — rating summary and verified patient feedback.
7. Settings — profile, fee, languages, and notification preferences.

## Major choices

- Deep teal feels medical and dependable without making the interface cold.
- A neutral background keeps patient and appointment details easier to scan.
- The mobile bottom bar keeps the most common work within one thumb tap.
- Clinic names remain visible on every appointment so old history still makes sense after a doctor moves.
- Real operational states make the product understandable before it is connected to live data.
