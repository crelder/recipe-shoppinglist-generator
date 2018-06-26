/*var vueObject = new Vue(
    {
        el: '#app',
        data: {
            title: 'Hello World!'
        }
    }
);*/


function showAllRezeptNamenEinkaufsListe() {
  var rezepteString = '';
    for (var i = 0; i < einkaufsListeRezepte.length - 1; i++) {
      rezepteString += einkaufsListeRezepte[i].toUpperCase() + ', ';
  }
  rezepteString += einkaufsListeRezepte[einkaufsListeRezepte.length - 1].toUpperCase()
  console.log(rezepteString.toUpperCase());
}


function showAllRezepte() {
  for (var i = 0; i < rezepteSammlung.length; i++) {
      console.log(rezepteSammlung[i].rezeptName.toUpperCase());
      for (var j = 0; j < rezepteSammlung[i].zutaten.length; j++) {
          console.log(rezepteSammlung[i].zutaten[j].menge + rezepteSammlung[i].zutaten[j].einheit + ' ' + rezepteSammlung[i].zutaten[j].zutat);
      }
      console.log("\"" + rezepteSammlung[i].kommentar + "\"");
      console.log(" ");
  }
}


function zutatPositionInEinkaufsListe(zutat) {
  for (var i = 0; i < einkaufsListe.length; i++) {
      if (einkaufsListe[i][2] == zutat) {
          return i;
          break;
      }
  }
}


function einkaufsListeHatBereitsZutat(zutat) {
  for (var i = 0; i < einkaufsListe.length; i++) {
      if (einkaufsListe[i][2] == zutat) {
          return true;
      }
  }
}


function printSpacePadded(menge, einheit, zutat) {
  var textString = menge + einheit;
  while (textString.length < 10) {
      textString = " " + textString;
  }
  textString += ' ' + zutat;
  return textString;
}


function printEinkaufsListe() {
  for (var i = 0; i < einkaufsListe.length; i++) {
      console.log(printSpacePadded(einkaufsListe[i][0], einkaufsListe[i][1], einkaufsListe[i][2]));
      // console.log(einkaufsListe[i][2] + ": " + einkaufsListe[i][0] + einkaufsListe[i][1]);
  }
}


var einkaufsListe = [];

function generate(menge, einheit, zutat) {
  if (einkaufsListeHatBereitsZutat(zutat)) {
      einkaufsListe[zutatPositionInEinkaufsListe(zutat)][0] += menge;
  } else {
      einkaufsListe[einkaufsListe.length] = [menge, einheit, zutat];
  }
}


var einkaufsListeRezepte = [];

function generateRezeptName(rezeptName) {
  einkaufsListeRezepte[einkaufsListeRezepte.length] = rezeptName;
}


function askRezepteFuerDieWoche() {
//   for (var i = 0; i < rezepteSammlung.length; i++) { <!-- For development mode: change back to production mode -->
    for (var i = 0; i < 2; i++) {
      if (confirm('Willst Du "' + rezepteSammlung[i].rezeptName + '"?') == true) {
          for (var j = 0; j < rezepteSammlung[i].zutaten.length; j++) {
              generate(rezepteSammlung[i].zutaten[j].menge, rezepteSammlung[i].zutaten[j].einheit, rezepteSammlung[i].zutaten[j].zutat);
          }
          generateRezeptName(rezepteSammlung[i].rezeptName);
      }
  }
}

/* var grundzutaten =['Salz','Zucker','Zimt','Olivenöl','Balsamico-Essig','Weißweinessig','Pfeffer','Senf'];
function printGrundZutaten(){
for (var i = 0; i < grundzutaten.length; i++) {
  console.log((i +1) + '. ' grundzutaten[i]);
};
}*/

/* test */

import * as data from './recipes.json';
const rezepteSammlung = data;

// Weitere Rezepte
// Pizza, Gemüseauflauf, Zaiziki mit Weißbrot, Spanische Tortilla, Apfelkuchen, Spagetthi Bolognese, Thunfischsalat, Couscous-Salat


// //////////////////////////////////////////
// Ausgabe///////////////////////////////////
// /////////////////////////////////////////
askRezepteFuerDieWoche();
console.log("--------------EINKAUFSLISTE--------------");
printEinkaufsListe();

console.log(" ");

// printGrundZutaten();

console.log(" ");

console.log("Damit kann man folgende Rezepte kochen:");
showAllRezeptNamenEinkaufsListe();

console.log(" ");
console.log(" ");

console.log("--------------REZEPTE--------------------")
showAllRezepte();

console.log(JSON.stringify(rezepteSammlung));
console.log("Das ist jetzt auf jeden Fall der Developer Path!!");