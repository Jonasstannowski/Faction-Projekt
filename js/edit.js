document.addEventListener("DOMContentLoaded",init);
document.getElementById("Qualitaet").addEventListener("input", updateBewertungAnzeige);

function updateBewertungAnzeige() {
	let rangeInput = document.getElementById('Qualitaet');
	let anzeigeElement = document.getElementById('bewertungAnzeige');
	let value = rangeInput.value;
	anzeigeElement.textContent = value;
}

let id;

function init() {
	document.getElementById("btn_update_data").addEventListener("click", updateData);
	openDB();
	if(typeof(Storage) != "undefined") {
		id = parseInt(localStorage.edit);
	}
	db.transaction(
		function(tx){
			tx.executeSql("SELECT * FROM Bewertungen WHERE id=?", [id], fillForm, SQLFail);
		}
	);
}

function fillForm(tx, result){
	if(result.rows.length > 0){
		let data = result.rows.item(0);
		document.getElementById('Name').value = data.Name;
		document.getElementById('Hersteller').value = data.Hersteller;
		document.getElementById('Datum').value = data.Datum;
		document.getElementById('Qualitaet').value = data.Qualitaet;
		document.getElementById('Beschreibung').value
	}else{
		alert("ID in der Datenbank unbekannt");
	}
}

function SQLFail(){
	alert("Fehler im SQL-Query");
}


function openDB(){
    db = openDatabase('myDB','1.0','datenbankorientierte Systementwicklung',1024*1024); //DB mit 1MB
}

function updateData() {
	let Name = document.getElementById('Name').value;
	let Hersteller = document.getElementById('Hersteller').value;
	let Datum = document.getElementById('Datum').value;
	let Qualitaet = document.getElementById('Qualitaet').value;
	let Beschreibung = document.getElementById('Beschreibung').value;
	db.transaction(
		function(tx){
			tx.executeSql("UPDATE Bewertungen SET Name=?, Hersteller=?, Datum=?, Qualitaet=?, Beschreibung=? WHERE id=?", [Name, Hersteller, Datum, Qualitaet, Beschreibung , id], updateSuccess, SQLFail);
		}
	);
}

function updateSuccess(){
	alert("Daten gespeichert!");
	document.location.href="meinekopfhoerer.html";
}