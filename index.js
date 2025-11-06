let spells;
let spells_obj = {};
let spells_eileen_json;
let spells_eileen = [];
const schools = {
    A: {name: "Abjuration", short:"Abj."},
    C: {name: "Conjuration", short:"Conj."},
    D: {name: "Divination", short:"Div."},
    E: {name: "Enchantment", short:"Ench."},
    I: {name: "Illusion", short:"Ill."},
    N: {name: "Necromancy", short:"Nec."},
    T: {name: "Transmutation", short:"Tr."},
    V: {name: "Evocation", short:"Ev."},
}

async function init(){
    spellsTableTbody = document.getElementById("spellsListTableTbody");
    try{
        spells = (await fetchJSON('./spells/spells-xphb.json'))["spell"];
        spells_eileen_json = (await fetchJSON('./eileen_spells.json'))["items"];
    } catch (e){
        console.error(e);
        return;
    }
    spells.forEach(spell => {
        spells_obj[spell.name.toLowerCase()] = spell;
    });
    spells_eileen_json.forEach(spell => {
        spell_name = decodeURI(spell['h'].split('_')[0]);
        spells_eileen.push(spells_obj[spell_name]);
    });
    spells_eileen.sort((a,b) => {
        if (a.level === b.level)
            return (a.name).localeCompare(b.name);
        else
            return a.level - b.level;
    });
    spells_eileen.forEach(spell => {
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        tdName.textContent = spell.name;
        let tdLevel = document.createElement('td');
        tdLevel.textContent = spell.level;
        let tdTime = document.createElement('td');
        tdTime.textContent = `${spell.time[0].number} ${spell.time[0].unit}` ;
        let tdSchool = document.createElement('td');
        tdSchool.textContent = schools[spell.school].short;
        let tdConcentration = document.createElement('td');
        tdConcentration.textContent = spell.duration[0].concentration?"X":"";
        let tdRange = document.createElement('td');
        tdRange.textContent = `${spell.range.distance.amount?spell.range.distance.amount:""} ${spell.range.distance.type}`;
        tr.appendChild(tdName);
        tr.appendChild(tdLevel);
        tr.appendChild(tdTime);
        tr.appendChild(tdSchool);
        tr.appendChild(tdConcentration);
        tr.appendChild(tdRange);
        spellsTableTbody.appendChild(tr);
    });
    drawSpellCard(0);

    const rows = document.querySelectorAll('#spellsListTable tr');
    Array.from(rows).forEach((row, index) => {
        if (index != 0) {
            row.addEventListener("click", () => {
                drawSpellCard(index - 1);
            });
        }
    });
}

async function fetchJSON(url){
    let response = await fetch(url);
    json = await response.json();
    return json;
}

function drawSpellCard(spellId){
    sp = spells_eileen[spellId];
    document.getElementById('spellCardTitle').innerHTML = getSpellTitle(sp);
    document.getElementById('spellCardBody').innerHTML = `<p class="card-text"><strong>Casting Time:</strong> ${sp.time[0].number} ${sp.time[0].unit}</p>
        <p class="card-text"><strong>Range:</strong> ${sp.range.distance.amount?sp.range.distance.amount:""} ${sp.range.distance.type}</p>
        <p class="card-text"><strong>Components:</strong> ${getSpellComponents(sp)}</p>
        <p class="card-text"><strong>Duration:</strong> ${getDuration(sp)}</p>
        ${getEntries(sp)}
        ${getSpellUpgrade(sp)}
        <p class="card-text"><strong>Source:</strong> ${sp.source}, page ${sp.page}</p>`;
}

function getSpellTitle(sp){
    return `${sp.name} <small class="text-body-secondary">(Level ${sp.level} ${schools[sp.school].name})</small>`
}

function getSpellComponents(sp){
    let components = "";
    if (sp.components.v) components += "V, ";
    if (sp.components.s) components += "S, ";
    if (sp.components.m) {
        if (typeof sp.components.m === 'object'){
            components += `M (${sp.components.m.text})`;
        } else {
            components += `M (${sp.components.m})`;
        }
    }
    return components;
}

function getDuration(sp){
    let dur = sp.duration[0];
    if (dur.type === "timed"){
        return `${dur.duration.amount} ${dur.duration.type}`
    }
    return dur.type;
}

function getEntries(sp){
    let entries = "";
    sp.entries.forEach(entry => {
        if (typeof entry === 'object'){
            if (entry.hasOwnProperty('entries')){
                entries += `<p class="card-text"><strong>${entry.name}.</strong> ${entry.entries[0]}</p>`
            } else {
                entry.items.forEach( item => {
                    entries += `<p class="card-text"><strong>${item.name}.</strong> ${item.entries[0]}</p>`
                });
            }
            
        } else {
            entries += `<p class="card-text">${entry}</p>`
        }
    });
    return entries;
}

function getSpellUpgrade(sp){
    if(sp.hasOwnProperty('entriesHigherLevel')){
        return `<p class="card-text"><strong>${sp.entriesHigherLevel[0].name}.</strong> ${sp.entriesHigherLevel[0].entries[0]}</p>`;
    }
    return "";
}

init();