let items;
let items_obj = {};

async function init(){
    itemsTableTbody = document.getElementById("itemsListTableTbody");
    try{
        items = (await fetchJSON('./items.json'))["item"];
        //spells_eileen_json = (await fetchJSON('./eileen_spells.json'))["items"];
    } catch (e){
        console.error(e);
        return;
    }
    items.forEach(item => {
        items_obj[item.name.toLowerCase()] = item;
    });
}

init();