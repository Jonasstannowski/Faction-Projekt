document.addEventListener("DOMContentLoaded",init);

function updateRezensionenAnzeige() {
	let anzeigeElement = document.getElementById('RezensionenAnzeige');
	let value = rangeInput.value;
	anzeigeElement.textContent = value;
}

let id;

function init() {
	document.getElementById("btn_save_data").addEventListener("click", updateData);
	openDB();
	if(typeof(Storage) != "undefined") {
		id = parseInt(localStorage.edit);
	}
	db.transaction(
		function(tx){
			tx.executeSql("SELECT * FROM Rezensionen WHERE id=?", [id], fillForm, SQLFail);
		}
	);
}

function fillForm(tx, result){
	if(result.rows.length > 0){
		let data = result.rows.item(0);
		document.getElementById('Modell').value = data.Modell;
		document.getElementById('Benutzername').value = data.Benutzername;
		document.getElementById('Beschreibung').value = data.Beschreibung;
	}else{
		alert("ID in der Datenbank unbekannt");
	}
}

function SQLFail(){
	alert("Fehler im SQL-Query");
}


function openDB(){
    db = openDatabase('myDB','1.0','Faction Skis',1024*1024); 
}

function updateData() {
  let Modell = document.getElementById('Modell').value;
	let Benutzername = document.getElementById('Benutzername').value;
	let Beschreibung = document.getElementById('Beschreibung').value;
	db.transaction(
		function(tx){
			tx.executeSql("UPDATE Rezensionen SET Modell=?, Benutzername=?, Beschreibung=? WHERE id=?", [Modell, Benutzername, Beschreibung , id], updateSuccess, SQLFail);
		}
	);
}

function updateSuccess(){
	alert("Daten gespeichert!");
	document.location.href="rezensionen.html";
}
