const START_DATE = "2026-02-17";
const MILESTONES_ARCHIVE = [21, 41, 71, 91];
const MILESTONES = [117, 141, 157, 171];

const SCALE_PADDING = 13;
const rawMin = Math.min(...MILESTONES);
const rawMax = Math.max(...MILESTONES);
const min = Math.max(0, rawMin - SCALE_PADDING);
const max = rawMax;
const range = max - min;

const elements = {
    days: document.getElementById('d'),
    subs: document.getElementById('subs'),
    fill: document.getElementById('fill'),
    bg: document.getElementById('bg'),
    daysLabel: document.getElementById('days-label'),
    milestonesArchive: document.getElementById('milestones-archive-content')
};

const update = () => {
    const start = new Date(START_DATE);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = Math.max(0, Math.floor((today - start) / 864e5));
    elements.days.textContent = totalDays;

    // Berechnung Monate
    let fullMonths =
        (today.getFullYear() - start.getFullYear()) * 12 +
        (today.getMonth() - start.getMonth());

    if (today.getDate() < start.getDate()) {
        fullMonths--;
    }

    fullMonths = Math.max(0, fullMonths);
    const monthStart = new Date(start);
    monthStart.setMonth(start.getMonth() + fullMonths);
    const remainingDays = Math.floor((today - monthStart) / 864e5);

    // Labels
    const daysLabel = totalDays === 1 ? 'tag' : 'tage';
    const monthLabel = fullMonths === 1 ? 'monat' : 'monate';
    const dayLabel = remainingDays === 1 ? 'tag' : 'tage';

    elements.daysLabel.textContent = daysLabel;

    elements.subs.innerHTML = `
        <div class="stat-wrds stat-main">
            <span class="stat-part">
                <span class="stat-zahl">${fullMonths}</span> ${monthLabel}
            </span>
            <span class="stat-part">
                <span class="stat-zahl">${remainingDays}</span> ${dayLabel}
            </span>
        </div>
    `;

    // Archiv Meilensteine
    elements.milestonesArchive.textContent = MILESTONES_ARCHIVE.join(' • ');

    // update Fortschrittsbalken
    const progress = Math.min(Math.max((totalDays - min) / range, 0), 1);
    elements.fill.style.width = progress * 100 + "%";

    // Entfernen alter Marker
    elements.bg.querySelectorAll('.marker').forEach(el => el.remove());

    // Setzen der Marker
    const frag = document.createDocumentFragment();

    [0, ...MILESTONES].forEach(m => {
        const mk = document.createElement('div');
        mk.className = `marker ${totalDays >= m ? 'reached' : ''}`;

        const pos = (m - min) / range;
        mk.style.left = Math.min(Math.max(pos, 0), 1) * 100 + "%";

        const label = document.createElement('span');
        label.className = 'marker-label';
        label.textContent = m;

        mk.appendChild(label);
        frag.appendChild(mk);
    });
    elements.bg.appendChild(frag);
};

update();
