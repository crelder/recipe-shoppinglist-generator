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
};


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
  for (var i = 0; i < rezepteSammlung.length; i++) {
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

rezepteSammlung = [{
      rezeptName: "Rucola Salat",
      zutaten: [{
          menge: 0.5,
          einheit: "Packung",
          zutat: "Parmesan"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Rucula Salat"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Tomaten"
      }],
      kommentar: "Parmesan in hauchdünne Scheiben mit Reibe schaben. Cocktail Tomaten sehen gut darauf aus.",
  },

  {
      rezeptName: "Griechischer Salat",
      zutaten: [{
          menge: 1,
          einheit: "",
          zutat: "Gurke"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Tomaten"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Schafskäse"
      }, {
          menge: 12,
          einheit: "",
          zutat: "Oliven"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Zwiebel"
      }],
      kommentar: "Zutaten in dicke Scheiben schneiden. Griechenland-Style! Zwiebeln in Ringe schneiden und etwas Salz darüber und kurz stehen lassen. Dann werden die weicher und sind nicht mehr so scharf.",
  },

  {
      rezeptName: "Grießbrei",
      zutaten: [{
          menge: 1,
          einheit: "Packung",
          zutat: "Weichweizengrieß"
      }, {
          menge: 500,
          einheit: "ml",
          zutat: "Milch"
      }],
      kommentar: "Umrühren nicht vergessen! 2,5 zu 1 Verhältnis Milch zu Gries. Zimt noch drüber streuen.",
  }, {
      rezeptName: "Pizza Seelen",
      zutaten: [{
          menge: 250,
          einheit: "g",
          zutat: "Reibekäse"
      }, {
          menge: 250,
          einheit: "ml",
          zutat: "Süße Sahne"
      }, {
          menge: 250,
          einheit: "g",
          zutat: "Schinken"
      }, {
          menge: 0.25,
          einheit: "Tube",
          zutat: "Tomatenmark"
      }, {
          menge: 3,
          einheit: "",
          zutat: "Seelen"
      }],
      kommentar: "Kann man statt mit Seelen auch mit Brotscheiben machen. Käse und Schinken in würfeln. Reibekäse: Gouda Mittelalt. Pizzagewürz, Salz, Pfeffer.",
  }, {
      rezeptName: "Rührei mit Speck",
      zutaten: [{
          menge: 1,
          einheit: "Packung",
          zutat: "Speckwürfel"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 0.5,
          einheit: "Packung",
          zutat: "Parmesan"
      }, {
          menge: 1,
          einheit: "Schachtel",
          zutat: "Schnittlauch"
      }],
      kommentar: "Geht auch als Mittag oder Abendessen. Gehaltvoll.",
  }, {
      rezeptName: "Bratkartoffeln",
      zutaten: [{
          menge: 5,
          einheit: "",
          zutat: "Kartoffeln"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Zwiebel"
      }],
      kommentar: "Gehackte Zwiebeln in Fett anbraten. Gute Pfanne, damit es nicht einbackt. Geht auch als Mittag oder Abendessen. Gehaltvoll.",
  }, {
      rezeptName: "Früchtemüsli",
      zutaten: [{
          menge: 2000,
          einheit: "ml",
          zutat: "Milch"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Köln Haferflocken (blau)"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Ovomaltine"
      }, {
          menge: 5,
          einheit: "",
          zutat: "Bananen"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Äpfel"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Sonstige Saisonfrüchte für Müsli"
      }],
      kommentar: "Tradition bewahren!",
  }, {
      rezeptName: "Spaghetti Carbonara",
      zutaten: [{
          menge: 150,
          einheit: "g",
          zutat: "Speckwürfel"
      }, {
          menge: 3,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 100,
          einheit: "ml",
          zutat: "Süße Sahne"
      }, {
          menge: 0.5,
          einheit: "Packung",
          zutat: "Parmesan"
      }, {
          menge: 200,
          einheit: "g",
          zutat: "Spaghetti"
      }, ],
      kommentar: "Vorsicht mit dem Salz - wegen dem Speck; kein Salz in die Soße! Schinkenwürfel anbraten. Salz, Pfeffer und alle anderen Zutaten verquillen. Alles zusammen über die abgetropften Spaghetti. Erneut abschmecken mit S+P. Wie im Vapiano in Berlin. ",
  }, {
      rezeptName: "Pfannenkuchen",
      zutaten: [{
          menge: 3,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 400,
          einheit: "g",
          zutat: "Mehl"
      }, {
          menge: 400,
          einheit: "ml",
          zutat: "Milch"
      }, {
          menge: 1,
          einheit: "Glas",
          zutat: "Apfelmus"
      }, {
          menge: 1,
          einheit: "Glas",
          zutat: "Marmelade"
      }, ],
      kommentar: "Da kann auch Reibekäse darauf.",
  }, {
      rezeptName: "Käsespätzle",
      zutaten: [{
          menge: 500,
          einheit: "g",
          zutat: "Mehl"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 3,
          einheit: "",
          zutat: "Zwiebel"
      }, {
          menge: 300,
          einheit: "g",
          zutat: "Bergkäse"
      }, ],
      kommentar: "Alternativ kann man auch mit Instantmehl halb/halb mischen, wenn kein Spätzlemehl vorhanden. Mit Prise Salz und kaltem Wasser den Teig machen. Käse: Bergkäse, aber nicht zu alt. Eher ein junger/mittelalt Bergkäse - sonst zu trocken.",
  }, {
      rezeptName: "Schweizer Wurstsalat",
      zutaten: [{
          menge: 200,
          einheit: "g",
          zutat: "Bergkäse"
      }, {
          menge: 200,
          einheit: "g",
          zutat: "Schinkenwurst"
      }, {
          menge: 0.5,
          einheit: "Glas",
          zutat: "Essiggurke"
      }, ],
      kommentar: "Mittelalter Bergkäse - nicht zu alt. Die kleineren Gurken; in Scheiben schneiden. Normaler Heller Essig, Öl, Pfeffer, Prise Zucker und Essiggurkensud einen Schuss dazu. Vermengen. Die Zwiebelringe (kleinere Zwiebeln) in Salz legen und am Schluss oben darauf zur Dekoration.",
  }, {
      rezeptName: "Kartoffelsalt und Spiegelei",
      zutaten: [{
          menge: 8,
          einheit: "",
          zutat: "Kartoffeln"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Zwiebel"
      }, ],
      kommentar: "(Vorwiegend) Festkochend. Kartoffeln in der Schale kochen. Schälen. In Scheiben schneiden. Wasser heiß machen mit Gemüsebrühe, Senf, Salz, Pfeffer, Prise Zucker, heller Essig (kein Balsamico) und gehackte Zwiebeln (werden dadurch milder). Die Brühe über die Kartoffeln schütten und umrühren. Stehen lassen: 15 min (Kartoffeln ziehen das auf). Dann Öl darüber (Öl schließt das ab.).",
  }, {
      rezeptName: "Zitronenkuchen",
      zutaten: [{
          menge: 250,
          einheit: "g",
          zutat: "Margarine"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Zitrone"
      }, {
          menge: 150,
          einheit: "g",
          zutat: "Zucker"
      }, {
          menge: 4,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 300,
          einheit: "g",
          zutat: "Mehl"
      }, {
          menge: 100,
          einheit: "g",
          zutat: "Speisestärke"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Backpulver"
      }, {
          menge: 50,
          einheit: "ml",
          zutat: "Milch"
      }, {
          menge: 250,
          einheit: "g",
          zutat: "Puderzucker"
      }, ],
      kommentar: "Formdurchmesser ca. 28 cm. 1 große Zitrone mit unbehandelter Schale. 3 für den Saft für die Soße und Glasur. 8 EL Milch. Alles bis auf Mehl und Speisestärke schaumig rühren. Dann erst die letzten beiden dazu fügen. Form ausfetten. 175°C vorheizen und 45-50 Minuten backen. Auf Abkühlblech. // Saft von 2 Zitronen, 4 EL Zucker und 4 EL Wasser aufkochen. (Zitronenlikör hinzufügen). Drüber träufeln. Kuchen abkühlen lassen. // ",
  }, {
      rezeptName: "Marmorkuchen",
      zutaten: [{
              menge: 375,
              einheit: "g",
              zutat: "Margarine"
          }, {
              menge: 225,
              einheit: "g",
              zutat: "Zucker"
          }, {
              menge: 540,
              einheit: "g",
              zutat: "Mehl"
          }, {
              menge: 4,
              einheit: "",
              zutat: "Eier"
          }, {
              menge: 190,
              einheit: "ml",
              zutat: "Milch"
          },
          // {menge: 150, einheit: "g", zutat: "Speisestärke"},
          {
              menge: 1.5,
              einheit: "Packung",
              zutat: "Backpulver"
          }, {
              menge: 60,
              einheit: "g",
              zutat: "Kakaopulver"
          },
      ],
      kommentar: "20 g Zucker in Kakaomasse. Evtl. noch 1 EL Milch in Kakaomasse. Guggelhupfform 2/3 füllen. 175°C vorheizen und 45-50 min backen. Bevor Kuchen aus Form, abkühlen lassen!",
  }, {
      rezeptName: "Gemüse / Spinat Lachs Quiche",
      zutaten: [{
          menge: 1,
          einheit: "Becher",
          zutat: "Sahne"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Eier"
      }, {
          menge: 1,
          einheit: "",
          zutat: "Knoblauch"
      }, {
          menge: 200,
          einheit: "g",
          zutat: "Mehl"
      }, {
          menge: 100,
          einheit: "g",
          zutat: "Butter"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Blattspinat"
      }, {
          menge: 1,
          einheit: "Packung",
          zutat: "Lachs"
      }, ],
      kommentar: "Gemüse schneiden. Teig: Salz, Mehl, Butter, Wasser. Backofen vorheizen. Teig in die Form. Teig in Ofen (15 min). Gemüse andünsten. Es kann alles mögliche Gemüse wie: Zuchini, Zwiebeln, Karotten, Lauch, Oberginen, Tomatenscheiben für oben. Für die Soße die Sahne mit dem Ei verquillen (mit Ei wird die Quiche fester), Salz, Pfeffer und Muskat. Die Soße zum Gemüse dazu geben.",
  },
];

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