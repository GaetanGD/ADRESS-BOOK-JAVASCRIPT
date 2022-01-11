// --- Constantes et variables globales
const keyLocalStorage = 'TabContact';

// Objets DOM.
let nomField = document.getElementById('nom');
let prenomField = document.getElementById('prenom');
let phoneField = document.getElementById('phone');
let emailField = document.getElementById('email');

let contenu = document.getElementById('address-book');

let btnValider = document.getElementById('save-contact');
let btnDeleteAll = document.getElementById('delete-address-book');

// Le carnet d'adresses (tableau d'objets représentant chacun un contact).
let contacts = [];

// --- Fonctions du carnet d'adresses
function createContact(nom, prenom, phone, mail){

    //on creer l'objet qui va contenir les valeurs saisies dans le formulaire
    let obj = {
        'nom':nom,
        'prenom':prenom,
        'phone':phone,
        'mail':mail
    };

    addToLocalStorage(keyLocalStorage, obj);
}

function updateContact(index, nom, prenom, phone, mail){

    //on recréer un objet pour formater le resultat
    let obj = {
        'nom':nom,
        'prenom':prenom,
        'phone':phone,
        'mail':mail
    };

    //je recupere le localstorage par rapport a sa clé
    let dataLocalStorage = window.localStorage.getItem(keyLocalStorage);
    //je parse le resultat pour passer d'un flux JSON a un tableau de données
    dataLocalStorage = JSON.parse(dataLocalStorage);

    //je remplace l'objet dans le tableau par le nouveau via son index
    dataLocalStorage.splice(index, 1, obj);

    //on remet les nouvelles informations dans le localStorage
    window.localStorage.setItem(keyLocalStorage, JSON.stringify(dataLocalStorage));

    //je repasse en mode ajout
    btnValider.dataset.mode = "ajout";

    //je modifi le texte dans le bouton
    btnValider.innerHTML = "Ajouter";
}

function addToLocalStorage(key, valeur){

    //je recupere le local disponible par rapport a la clé specifié en parametre
    let dataLocalStorage = window.localStorage.getItem(key);
    
    //je test si la clé existe dans le localstorage
    if(localStorage.getItem(key) !== null){
        //si elle existe, je parse sont contenu pour obtenir un tableau depuis la string
        dataLocalStorage = JSON.parse(dataLocalStorage);
        //je pousse le nouvel objet dans le tableau
        dataLocalStorage.push(valeur);
        //j'ecrase le localstorage existant avec le tableau et ses nouvelles données
        window.localStorage.setItem(key, JSON.stringify(dataLocalStorage));
    }else{
        //si la clé n'as pas été trouvé dans le localstorage, alors je créer un tableau
        let contacts = [];
        //je pousse le nouvel objet dans le tableau
        contacts.push(valeur);
        //j'insere le tableau de donnée en JSON dans le localstorage
        window.localStorage.setItem(key, JSON.stringify(contacts));
    }
}

function onClickSaveContact(){

    //Recuperation des valeurs de champs
    let nomValue = nomField.value;
    let prenomValue = prenomField.value;
    let phoneValue = phoneField.value;
    let emailValue = emailField.value;

    //on test si on se trouve en mode edition
    if(btnValider.dataset.mode == "edition"){
        //modification d'un contact
        updateContact(btnValider.dataset.idencour ,nomValue, prenomValue, phoneValue, emailValue);
    }else{
        //Creation du contact
        createContact(nomValue, prenomValue, phoneValue, emailValue);
    }

    //appel de la fucntion refresh
    refresh();

    //Appel de la function resetField
    resestField();
}

//rafraichissement du carnet de contact au niveau du HTML
function refresh(){
    //si le localStorage (avec notre clé) est différent de null, donc il existe
    if(localStorage.getItem(keyLocalStorage) !== null){
        
        //recuperation de la chaine sui se trouve dans le localStorage grace a la clé
        let data = window.localStorage.getItem(keyLocalStorage);
        
        //transformation de la chaine en tableau de donnée
        data = JSON.parse(data);
        
        let contenuString = "";

        //boucle pour parcourir le tableau de données
        for(let i = 0; i < data.length; i++){
            
            let contact = data[i];

            contenuString += '<li class="card">';
            contenuString += '<div class="card-body">';
            contenuString += '<i class="trash-contact fas fa-trash" data-contactid="' + i + '"></i>';
            contenuString += '<i class="edit-contact fas fa-edit" data-contactid="' + i + '"></i>';
            contenuString += '<h5>' + contact.nom + ' ' + contact.prenom + '</h5>';
            contenuString += '<p>' + contact.phone + '</p>';
            contenuString += '<p>' + contact.mail + '</p>';
            contenuString += '</div>';
            contenuString += '</li>';

        }
        //ou
        /*for(let contenu of data){
            console.log(contenu);
        }
        //ou
        data.forEach(element => {
            console.log(element);
        });*/

        //mise en place du contenu créer dans le html
        contenu.innerHTML = contenuString;
    }else{
        contenu.innerHTML = "";
    }

    //on appel la fonction qui mets la surveillance sur les boutons edit a chque fois que la liste s'actualise
    onClickEditData();
    onClickTrashData();
}

function onClickEditData(){
    //on recupere toutes les instances de bouton
    let btnEditContact = document.querySelectorAll('.edit-contact');
    //on boucle dessus pour mettre un ecouteur d'evenement sur chaque bouton
    for(btn of btnEditContact){
        btn.addEventListener('click', editContact);
    }
}

function onClickTrashData(){
    //on recupere toutes les instances de bouton
    let btnTrashContact = document.querySelectorAll('.trash-contact');
    //on boucle dessus pour mettre un ecouteur d'evenement sur chaque bouton
    for(btn of btnTrashContact){
        btn.addEventListener('click', trashContact);
    }
}

function editContact(event){
    //je recupere l'index de la card sur laquelle je viens de cliquer
    //le dataset permet de recuperer une valeur stocker grace a l'attribut 'data-?????'
    //dans notre cas 'contactid' est présent dans le html sous la forme 'data-contactid'
    //dans la function 'refresh()' au environ de la ligne 93.
    let id = event.currentTarget.dataset.contactid;
    //je recupere les données qui sont dans le localstorage
    let data = window.localStorage.getItem(keyLocalStorage);
    //je parse les données en JSON pour obtenir un tableau de donnnées
    data = JSON.parse(data);
    //j'isole l'objet en function de l'index du tableau
    let contact = data[id];

    //je remplis les champs de mon formulaire
    nomField.value = contact.nom;
    prenomField.value = contact.prenom;
    phoneField.value = contact.phone;
    emailField.value = contact.mail;

    //grace au dataset je peux également ajouter des valeur dans le HTML
    //en specifiant un data-??? qui n'existe pas encore sur le html
    btnValider.dataset.mode = "edition";
    btnValider.dataset.idencour = id;

    //je modifi le texte dans le bouton
    btnValider.innerHTML = "Modifier";

}

function trashContact(event){
    //je recupere les données dans la localstorage
    let data = window.localStorage.getItem(keyLocalStorage);
    //je parse les données en JSON pour obtenir un tableau de donnnées
    data = JSON.parse(data);
    //je recupere l'index de la card sur laquelle je viens de cliquer
    //le dataset permet de recuperer une valeur stocker grace a l'attribut 'data-?????'
    //dans notre cas 'contactid' est présent dans le html sous la forme 'data-contactid'
    //dans la function 'refresh()' au environ de la ligne 93.
    let id = event.currentTarget.dataset.contactid;
    //j'isole l'objet en function de l'index du tableau
    let contact = data[id];

    //je demande confirmation avant suppression de la donnée
    if(confirm("Etes vous sûr de vouloir supprimer la carte : " + contact.nom + ' ' + contact.prenom)){
        //je remplace l'objet dans le tableau par le nouveau via son index
        data.splice(id, 1);
        //je reaffecte le localStorage avec le nouveau tableau
        window.localStorage.setItem(keyLocalStorage, JSON.stringify(data));
        //je refresh l'affichage des cards
        refresh();
    }
}

//Reinitialisation du formulaire (on vide les champs)
function resestField(){
    //je recupere l'intégralité du formulaire
    let formulaire = document.getElementById('formulaire');
    //reinitialisation du formaulaire
    formulaire.reset();
}

//function qui vide le carnet d'adresse complet
function onClickDeleteAddressBook(){
    let resultBtn = confirm("Êtes-vous sûr de vouloir supprimer tout le carnet d'adresses ?");
    //le resultat contenu dans la varibale resultBtn sera true ou false
    if(resultBtn){
        window.localStorage.removeItem(keyLocalStorage);
        refresh();
    }
}

// --- Code principal.
btnValider.addEventListener('click', onClickSaveContact);
btnDeleteAll.addEventListener('click', onClickDeleteAddressBook);

refresh();