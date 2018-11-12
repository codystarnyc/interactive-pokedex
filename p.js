// let pokedex = document.getElementById('pokedex');
let pwrbtn = document.getElementById('pwrbtn');
const ALL_POKEMON = [];
// group elements by class name to determine what should be
// made visible at what time.

pwrbtn.addEventListener('click', turnOn);
pwrbtn.addEventListener('click', depressBtn);
// // change background depending on which element
// // typewriter text in screen
// // flips to stat bars animation
let powerButton = false;
let atTop = true;
let atBottom = false;
let screen1 = document.querySelector('div#top-screen > div:first-child');
let submenu = document.querySelector('#submenu');
let pokemonLoaded = false;
let nextArrow = document.getElementById('next-pokemon');
let prevArrow = document.getElementById('prev-pokemon');
let screenInfo = {top: undefined, bottom: undefined};

nextArrow.addEventListener('click', getNextPokemon);
prevArrow.addEventListener('click', getNextPokemon);


document.addEventListener("keydown", function (event) {
    let cursor = document.getElementById('cursor');
    // 27 esc
    // up 38
    // if at the top, go to second one
    let dwn = 0;
    let up = 0;
    if (event.which == 40) {
        dwn++;
        let newVal = parseInt(cursor.style.top) + parseInt('19') + '%';
        cursor.style.top = newVal;
    } else if (event.which == 38) {
        let newVal = parseInt(cursor.style.top) - parseInt('19') + '%';
        cursor.style.top = newVal;
    }
})


function turnOn() {
    if (powerButton == true) {
        return console.log('Power is already on');
    }
    let screen1 = document.querySelector('div#top-screen > div:first-child');
    let screen2 = document.getElementById('screen2');
    // let cursor = document.getElementById('cursor');
    let light = document.getElementById('led');
    let menu = document.querySelectorAll('ul')[0];
    menu.classList.remove('hidden');
    // cursor.classList.remove('hidden');
    screen1.style.backgroundImage = 'url(\'noise.gif\')';
    screen2.style.backgroundColor = '#5A9B9D';
    powerButton = true;
    light.classList.remove('pwr-off');
    light.classList.add('pwr-on');
}

function shutdown() {
    powerButton = false;
    let screen2 = document.getElementById('screen2');
    let cursor = document.getElementById('cursor');
    let light = document.getElementById('led');
    let menu = document.querySelectorAll('ul')[0];
    if (pokemonLoaded == true) {
        let img = document.getElementById('pokemon-img');
        if (img != null) {
            document.getElementById('pokemon-img').remove();
            document.getElementsByClassName('pokemon-name')[0].remove();     
            document.getElementsByClassName('pokedex-info-bg')[0].remove();
        }
    }
    menu.classList.add('hidden');
    cursor.classList.add('hidden');
    screen1.style.background = '#376092';
    screen2.style.backgroundColor = '#376092';
    light.classList.remove('pwr-on');
    light.classList.add('pwr-off');
    for (el of document.getElementsByClassName('pdex-interface-top')) {
        el.classList.add('hidden');
    }
}

function depressBtn() {
    let btn = document.querySelector('#pwrbtn');
    btn.style.transform = 'scale(0.88)';
    // btn.style.boxShadow = '1px 1px 100px black';
    setTimeout(unpressBtn, 250);
}

function unpressBtn() {
    let btn = document.querySelector('#pwrbtn');
    // box-shadow: 10px 10px 5px grey;
    btn.style.transform = 'scale(1)';
}

function searchPokemon() {
    var q = prompt('Enter Pokemon ID number');
    if (q == undefined || q == '') {
        return console.log('cancelled');
    }
    console.log(`You searched for ${q}`);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
           var pokemon = JSON.parse(this.responseText);
           console.log(pokemon);
            if (pokemonLoaded == true) {
                clearBottomScreenText();
            }
           let existing_img = document.getElementById('pokemon-img');
           if (existing_img != null) {
               existing_img.remove();
               let name = document.getElementsByClassName('pokemon-name')[0];
               name.remove();
           }
        //    id name genus bgcolor desc
           new Pokemon(pokemon['id'],
                       pokemon['name'],
                       pokemon['genera'][2]['genus'],
                       pokemon['color']['name'],
                       pokemon['flavor_text_entries'][2]['flavor_text'],
           );
           screen1.style.backgroundColor = 'lightblue';
           screen1.style.backgroundImage = `linear-gradient(lightblue, ${pokemon['name'], pokemon['color']['name']})`;
           let img = document.createElement('img');
           let bgImg = document.createElement('img');
           bgImg.id = 'pokeballbg';
           bgImg.src = 'pokeball.png';
           bgImg.classList.add('pokedex-info-bg');
           let h3 = document.createElement('h3');
           h3.classList.add('pokemon-name');
           h3.innerHTML = pokemon['name'];
           if (q.length == 1) {
               var id = `00${q}`;
           } else if (q.length == 2) {
               var id = `0${q}`;
           } else {
               var id = `${q}`;
           }
           img.style.animation = 'fadeIn 0.8s';
           img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
           img.id = 'pokemon-img';
           img.classList.add('pokemon-image');
           submenu.classList.remove('hidden');
        //    setDesc()
        //    img.height = '300px';
        //    img.width = '300px';
           document.getElementById('top-screen').appendChild(h3);
           document.getElementById('top-screen').appendChild(img);
           document.getElementById('top-screen').appendChild(bgImg);
           setTimeout(showInfo, 250);
           pokemonLoaded = true;
           document.getElementsByClassName('menu')[0].classList.add('hidden');
            for (el of document.getElementsByClassName('pdex-interface-top')) {
                el.classList.remove('hidden');
            }
        } else if (this.readyState == 4 && this.status == 404) {
            alert('Pokemon ID out of range');
            return searchPokemon();
        }
    };
    // xhttp.open("GET", `http://fizal.me/pokeapi/api/v2/id/${q}.json`, true);
    xhttp.open("GET", `https://pokeapi.co/api/v2/pokemon-species/${q}/`, true);
    xhttp.send();
}

class Pokemon {
    constructor(id, name, genus, bgColor, desc) {
        this.id = id;
        this.name = name;
        this.genus = genus;
        this.bgColor = bgColor;
        this.desc = desc;
        ALL_POKEMON.push(this);
    }
}

function loadPokemon() {

}

function showInfo() {
        if (screen['bottom'] == 'info') {
            return console.log('Pokemon Info is already displaying');
        }
        let div = document.createElement('div');
        let h3 = document.createElement('h3');
        h3.id = 'pokemon-genus';
        div.id = 'pokemon-desc';
        h3.innerHTML = ALL_POKEMON[ALL_POKEMON.length - 1].genus;
        div.innerHTML = ALL_POKEMON[ALL_POKEMON.length - 1].desc;
        h3.classList.add('bottom-screen-text');
        div.classList.add('bottom-screen-text');
        screen2.appendChild(h3);
        screen2.appendChild(div);
        screen['bottom'] = 'info';
}

function showSkills() {
    document.createElement('div');
}

function showMenu() {
    clearBottomScreenText();
    let menu = document.querySelectorAll('ul')[0];
    menu.classList.remove('hidden');
    submenu.classList.add('hidden');
}

function clearBottomScreenText() {
    let div = document.getElementById('pokemon-desc');
    let h3 = document.getElementById('pokemon-genus');
    h3.remove();
    div.remove();
    screen['bottom'] = '';
}

function viewStats() {
    return alert(ALL_POKEMON[ALL_POKEMON.length - 1].name);
}

function getNextPokemon(direction) {
    let current_pokemon = ALL_POKEMON[ALL_POKEMON.length - 1].id;
    if (direction == undefined || direction.target.id == 'next-pokemon') {
        console.log(current_pokemon)
        var nextPokemon = current_pokemon + 1;
    } else if (direction.target.id == 'prev-pokemon') {
        console.log(current_pokemon)
        var nextPokemon = current_pokemon - 1;
    }
    if (nextPokemon <= 9) {
        var id = `00${nextPokemon}`;
    } else if (nextPokemon <= 99) {
        var id = `0${nextPokemon}`;
    } else {
        var id = `${nextPokemon}`;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var pokemon = JSON.parse(this.responseText);
            console.log(pokemon);
            if (pokemonLoaded == true) {
                clearBottomScreenText();
            }
            screen1.style.backgroundColor = 'lightblue';
            screen1.style.backgroundImage = `linear-gradient(lightblue, ${pokemon['name'], pokemon['color']['name']})`;
            document.getElementById('pokemon-img').remove();
            document.getElementById('pokeballbg').remove();
            document.getElementsByClassName('pokemon-name')[0].remove();
            let img = document.createElement('img');
            let bgImg = document.createElement('img');
            bgImg.src = 'pokeball.png';
            bgImg.id = 'pokeballbg';
            bgImg.classList.add('pokedex-info-bg');
            let h3 = document.createElement('h3');
            h3.classList.add('pokemon-name');
            h3.innerHTML = pokemon['name'];
            img.style.animation = 'fadeIn 0.8s';
            img.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
            img.id = 'pokemon-img';
            img.classList.add('pokemon-image');
            submenu.classList.remove('hidden');
            document.getElementById('top-screen').appendChild(h3);
            document.getElementById('top-screen').appendChild(img);
            document.getElementById('top-screen').appendChild(bgImg);
            new Pokemon(pokemon['id'],
                pokemon['name'],
                pokemon['genera'][2]['genus'],
                pokemon['color']['name'],
                pokemon['flavor_text_entries'][2]['flavor_text']
            );
            setTimeout(showInfo, 250);
            pokemonLoaded = true;
        }
    }
    xhttp.open("GET", `https://pokeapi.co/api/v2/pokemon-species/${nextPokemon}/`, true)
    xhttp.send();
}
