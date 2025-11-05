let spells;
let spells_obj = {};
let spells_eileen_json;
let spells_eileen = [];

async function init(){
    try{
        let response = await fetch('./spells/spells-xphb.json');
        spells = (await response.json())["spell"];
        response = await fetch('./eileen_spells.json');
        spells_eileen_json = (await response.json())["items"];
    } catch (e){
        console.error(e);
    }
    spells.forEach(spell => {
        spells_obj[spell.name.toLowerCase()] = spell;
    });
    spells_eileen_json.forEach(spell => {
        spell_name = decodeURI(spell['h'].split('_')[0]);
        spells_eileen.push(spells_obj[spell_name]);
    });
    console.log(spells_eileen);
}

init();