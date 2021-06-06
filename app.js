// main variables
let url = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/umrti.json';
let data = [];

// dom variables
const umrtiDataDOM = document.getElementById('umrti-data');
const infoDOM = document.getElementById('info');
const applyBtn = document.getElementById('apply');
const maxVek = document.getElementById('max-vek');
const kraje = document.getElementById('kraje');

fetch(url)
.then(res => res.json())
.then((out) => {
    data.push(out.data);

    console.log(data[0]);
    createTable(data[0], 1000, '');

    applyBtn.addEventListener('click', () => {
        umrtiDataDOM.innerHTML = "";
        createTable(data[0], document.getElementById('max-vek').value, kraje.value);
    });
})
.catch(err => { throw err });

function median(values){
    if(values.length ===0) return 0;
  
    values.sort(function(a,b){
      return a-b;
    });
  
    var half = Math.floor(values.length / 2);
  
    if (values.length % 2)
      return values[half];
  
    return (values[half - 1] + values[half]) / 2.0;
  }

function getRegion(code) {
    let krat = "";

    switch (code) {
        case 'CZ010':
            kraj = "Hlavní město Praha";
            break;

        case 'CZ020':
            kraj = "Středočeský kraj";
            break;

        case 'CZ031':
            kraj = "Jihočeský kraj";
            break;

        case 'CZ032':
            kraj = "Plzeňský kraj";
            break;

        case 'CZ041':
            kraj = "Karlovarský kraj";
            break;

        case 'CZ042':
            kraj = "Ústecký kraj";
            break;

        case 'CZ051':
            kraj = "Liberecký kraj";
            break;

        case 'CZ052':
            kraj = "Královehradecký kraj";
            break;

        case 'CZ053':
            kraj = "Pardubický kraj";
            break;

        case 'CZ063':
            kraj = "Kraj Vysočina";
            break;

        case 'CZ064':
            kraj = "Jihomoravský kraj";
            break;

        case 'CZ071':
            kraj = "Olomoucký kraj";
            break;

        case 'CZ072':
            kraj = "Zlínský kraj";
            break;

        case 'CZ080':
            kraj = "Moravskoslezský kraj";
            break;
    
        default:
            kraj = "chyba";
            break;
    }

    return kraj;
}

function createTable(data, maxVek, kraj) {
    let pocetMrtvych = 0;
    let zen = 0;
    let muzu = 0;
    let vekCelkem = 0;
    let veky = [];

    let tableTitles = document.createElement('li');
    tableTitles.classList.add('table-titles');
    tableTitles.innerHTML = "<span>Datum:</span><span>Kraj:</span><span>Věk:</span><span>Pohlaví:</span>";
    umrtiDataDOM.appendChild(tableTitles);

    data.forEach(element => {
        if(element.vek <= maxVek && kraj == getRegion(element.kraj_nuts_kod)
        || element.vek <= maxVek && kraj == ''
        || element.vek <= maxVek && kraj == 'vse') {
            vekCelkem += element.vek;
            pocetMrtvych++;
            if(element.pohlavi == 'M') {
                muzu++;
            } else {
                zen++;
            }

            veky.push(element.vek);

            // main
            let newItem = document.createElement('li');
            newItem.classList.add('item');
            newItem.innerHTML = "<span>" + element.datum + "</span><span>" + getRegion(element.kraj_nuts_kod) + "</span><span>" + element.vek + "</span><span>" + (("M" == element.pohlavi) ? "muž" : "žena") + "</span>";

            umrtiDataDOM.appendChild(newItem);
        }
    });

    // info
    infoDOM.innerHTML = "<p>Počet mrtvých:<br><b>" + pocetMrtvych + "</b></p>" + "<p>Průměrný věk:<br><b>" + (vekCelkem/pocetMrtvych).toFixed(2) + "</b></p>" + "<p>Medián věku:<br><b>" + median(veky) + "</b></p>" + "<p>Žen:<br><b>" + zen + "</b></p>" + "<p>Mužů:<br><b>" + muzu + "</b></p>"; 
}