document.addEventListener("DOMContentLoaded",init);
document.getElementById("btn_save_data").addEventListener("click", saveData);
document.getElementById("btn_delete_db").addEventListener("click", deleteStroage);
document.getElementById("btn_clear_fields").addEventListener("click", clearFields);

function init() {
	openDB();
	console.log(db);
	db.transaction(tabelleErzeugen);
	setDefaultDate();
	db.transaction(getAllRezensionen);
}

function tabelleErzeugen(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS Rezensionen (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Modell VARCHAR (20), Benutzername VARCHAR(45) NOT NULL, Beschreibung TEXT)", [], getAllRezensionen, SQLFail);
}


function saveData() {
	db.transaction(addRezensionen);

}

function SQLSuccess(){
    console.log("Success");
	clearFields();
}

function SQLFail(){
    console.log("Fail");
}

function deleteStroage() {
	db.transaction(dropTable);
}

function openDB(){
    db = openDatabase('myDB', '1.0', 'datenbankorientierte Systementwicklung', 1024*1024)
}

function dropTable(tx) {
   tx.executeSql("DROP TABLE IF EXISTS Rezensionenget", [], SQLSuccess, SQLFail);
}

function addRezensionen(tx) {
	let ModellInput = document.getElementById("Modell");
    let BenutzernameInput = document.getElementById( "Benutzername");
    let Modell = ModellInput.value;
    let Benutzername = BenutzernameInput.value;
	  let Beschreibung = document.getElementById("Beschreibung").value;

    if (Modell === "" || Benutzername === "") {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        ModellInput.classList.add("is-invalid");
       BenutzernameInput.classList.add("is-invalid");
        return;
	}

	tx.executeSql("INSERT INTO Rezensionen (Modell, Benutzername, Beschreibung) VALUES (?,?,?)", [Modell, Benutzername, Beschreibung], getAllRezensionen, SQLFail);
	clearFields();
    alert("Rezensionen gespeichert!")
}


function getAllRezensionen(tx){
	tx.executeSql("SELECT * FROM Rezensionen", [], displayResults, SQLFail);
}

function displayResults(tx, results){
  console.log(results);

  let html = document.getElementById('table-content');
  while (html.hasChildNodes()) {
    html.removeChild(html.firstChild)
  }


  for (let i = 0; i < results.rows.length; i++) {
    let item = results.rows.item(i);
    let tr = document.createElement('tr');
    //1. Spalte
    let td = document.createElement('td');
    td.textContent = item.id;
    tr.appendChild(td);
    //2. Spalte
    td = document.createElement('td');
    td.textContent = item.Modell;
    tr.appendChild(td);
    //3. Spalte
    td = document.createElement('td');
    td.textContent = item.Benutzername;
    tr.appendChild(td);
    //4. Spalte
    td = document.createElement('td');
    td.textContent = item.Beschreibung;
    tr.appendChild(td);
    //Löschen Button
    td = document.createElement('td');
    let btn = document.createElement('button');
    btn.setAttribute("class", "btn btn-primary");
    btn.setAttribute("data-action", "delete");
    btn.setAttribute("data-id", item.id);
    btn.textContent = "Löschen";
    td.appendChild(btn);
    tr.appendChild(td);

    td = document.createElement('td');
    btn = document.createElement('a');
    btn.setAttribute("class", "btn btn-info");
    btn.setAttribute("data-action", "edit");
    btn.setAttribute("data-id", item.id);
    btn.setAttribute("href", "edit.html");
    btn.textContent = "Bearbeiten";
    td.appendChild(btn);
    tr.appendChild(td);

    html.appendChild(tr);
  }

}

function clearFields() {
	document.getElementById("Modell").value = "";
	document.getElementById("Benutzername").value = "";
	document.getElementById("Beschreibung").value = "";
}
