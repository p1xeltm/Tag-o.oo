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
    version: document.getElementById('version'),
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

    let tempDate = new Date(start);
    let fullMonths = 0;

    while (true) {
        let nextMonth = new Date(tempDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (nextMonth <= today) {
            fullMonths++;
            tempDate = nextMonth;
        } else {
            break;
        }
    }

    const remainingDays = Math.floor((today - tempDate) / 864e5);
    const daysLabel = totalDays === 1 ? 'Tag' : 'Tage';
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

    // Meilensteine, Archiv
    elements.milestonesArchive.textContent =
    MILESTONES_ARCHIVE.join(' • ');

    // Progress-Bar
    elements.fill.style.width = Math.min(((totalDays - min) / range) * 100, 100) + "%"


    // Marker setzen
    const frag = document.createDocumentFragment();
    frag.appendChild(elements.fill);

    [0, ...MILESTONES].forEach(m => {
        const mk = document.createElement('div');
        mk.className = `marker ${totalDays >= m ? 'reached' : ''}`;

        const pos = ((m - min) / range);
        mk.style.left = Math.min(Math.max(pos, 0), 1) * 100 + "%";

        mk.innerHTML = `<span class="marker-label">${m}</span>`;
        frag.appendChild(mk);
    });

    elements.bg.innerHTML = '';
    elements.bg.appendChild(frag);
};

update();

fetch('version.json')
    .then(r => r.json())
    .then(d => elements.version.textContent = d.version);