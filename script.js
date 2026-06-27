const START_DATE = "2026-02-17";
const MILESTONES = [21, 41, 71, 91, 117, 141];

const elements = {
    days: document.getElementById('d'),
    subs: document.getElementById('subs'),
    fill: document.getElementById('fill'),
    bg: document.getElementById('bg'),
    version: document.getElementById('version'),
    daysLabel: document.getElementById('days-label')
};


const update = () => {
    const start = new Date(START_DATE);
    start.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = Math.max(0, Math.floor((today - start) / 864e5));
    const max = Math.max(...MILESTONES);

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

    // Progress-Bar
    elements.fill.style.width = Math.min((totalDays / max) * 100, 100) + "%";

    // Marker setzen
    const frag = document.createDocumentFragment();
    frag.appendChild(elements.fill);

    [0, ...MILESTONES].forEach(m => {
        const mk = document.createElement('div');
        mk.className = `marker ${totalDays >= m ? 'reached' : ''}`;
        mk.style.left = (m / max * 100) + "%";
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