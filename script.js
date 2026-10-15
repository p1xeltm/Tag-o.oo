const START_DATE = "2026-10-09";
const record = "7monate21tage";
const MILESTONES = [11, 19];

const SCALE_PADDING = 7;
const rawMin = Math.min(...MILESTONES);
const rawMax = Math.max(...MILESTONES);
const min = Math.max(0, rawMin - SCALE_PADDING);
const max = rawMax;
const range = max - min;

const elements = {
    tagesZahl: document.getElementById('tages-zahl'),
    monateTageBlock: document.getElementById('monate-tage-block'),
    fill: document.getElementById('fill'),
    bg: document.getElementById('bg'),
    tagesLabel: document.getElementById('tages-label'),
    milestonesArchive: document.getElementById('milestones-archive-content')
};

const update = () => {
    const start = new Date(START_DATE);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = Math.max(0, Math.floor((today - start) / 864e5));
    elements.tagesZahl.textContent = totalDays;

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

    elements.tagesLabel.textContent = daysLabel;

    elements.monateTageBlock.innerHTML = `
        <div class="statistik-text statistik-inhalt-haupt">
            <span class="statistik-teil">
                <span class="statistik-zahl">${fullMonths}</span> ${monthLabel}
            </span>
            <span class="statistik-teil">
                <span class="statistik-zahl">${remainingDays}</span> ${dayLabel}
            </span>
        </div>
    `;

    // Record-Text setzen
    elements.milestonesArchive.textContent = record;

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