//----------CREO LAS VARIABLES NECESARIAS PARA EL JUEGO-------------
//Creo un array vacío para llenarlo con las letras del abecedario
const characters = [];
//Creo una variable para almacenar el número de fallos y aciertos
let fallos = 0;
let aciertos = 0;
//URL de la API a la que le hago la consulta de la palabra secreta
const ApiUrl = "https://clientes.api.greenborn.com.ar/public-random-word";
    //Creo el array de palabras para adivinar
    // const palabrasArray = ['javascript', 'desarrollo', 'programacion', 'estudiante', 'lenguajes'];
//Creo la palabra secreta vacía que llenaré de forma aleatoria cuando le de a START
var palabraSecreta = '';
//Creo la variable random para almacenar la palabra generada de la API
var palabraRandom = '';


//----------PINTO EL TECLADO--------------
//Creo un bucle desde el 65 al 91 que son los números de la A a la Z del CharCode (no tiene Ñ)
//Ojo!! Las añado sólo en mayúsculas
for (let i = 65; i < 91; i++) {
    characters.push(String.fromCharCode(i));
}
//Añado manualmente la Ñ (Códido 209)
characters.push(String.fromCharCode(209));
//Compruebo que se me llena el array
// console.log(characters);

//Vuelco los datos del array para pintar los botones del teclado en mi inferface
//Los botones están deshabilitados para obligar al usuario a darle al START
for (let i = 0; i < characters.length; i++) {
    //Compruebo que me saca las letras una a una
    // console.log(characters[i])
    //Pinto el teclado añadiéndole un ID con la letra, el botón deshabilitado
    // y la llamada a la función con la letra por parámetro
    document.getElementById('teclas').innerHTML += `<button id="${characters[i]}" name="tecla" class="btn btn-success m-2 tecla fs-2" onclick="capturarLetra(${i})" disabled="true"> ${characters[i]} </button>`;
}


//------START------PINTO LA PALABRA Y RESETEO EL JUEGO-------------
function start() {
    //Hago petición a la API para que me genere la palabra secreta
    peticionAPI();
        //Selecciono aletaroriamente una de las palabras del array
        // const aleatorio = Math.floor(Math.random() * palabrasArray.length);
        //Selecciono la palabra a adivinar y la paso a mayúsculas
        // palabraSecreta = (palabrasArray[aleatorio]).toUpperCase();
    
    //Reseteo el ahoracado
    document.getElementById('imgAhorcado').src = `img/ahorcado0.png`;
    //Reseteo el espacio de la palabra secreta 
    document.getElementById('letras').innerHTML = "";
    //Reseteo el color a blanco
    document.getElementById('letras').className = "justify-content-center d-flex mx-5 text-white fw-bold";
    //Reseto el PNG correcto/error
    document.getElementById('check').innerHTML = "";
    //Reseteo el espacio ganador/perdedor
    document.getElementById('win').className = 'text-white visually-hidden';
    document.getElementById('lose').className = 'text-white visually-hidden';
    //Reinicio los fallos y los aciertos a 0
    fallos = 0;
    aciertos = 0;
    //Habilito el teclado para poder clickar en los botones
    for (let i = 0; i < characters.length; i++) {
        document.getElementById(`${characters[i]}`).disabled = false;
    }
    //Deshabilito el botón de START
    document.getElementById(`start`).disabled = true;
}

//-------PINTA LA PALABRA SECRETA CON GUIONES-----------------
function pintarPalabra(palabraRandom) {
    //Visualizo la palabra random que me viene de la API
    // console.log(palabraRandom);
    //Paso la palabra secreta a mayúsculas
    palabraSecreta = palabraRandom.toUpperCase();
    //Sustituyo todas las vocales con acento por vocales sin acento
    palabraSecreta = palabraSecreta.replace("Á", "A");
    palabraSecreta = palabraSecreta.replace("É", "E");
    palabraSecreta = palabraSecreta.replace("Í", "I");
    palabraSecreta = palabraSecreta.replace("Ó", "O");
    palabraSecreta = palabraSecreta.replace("Ú", "U");
    //Visualizo la palabra secreta en mayúsculas y sin acentos
    // console.log(palabraSecreta);
    //Capturo la longitud de la palabra para pintar los espacios
    for (let i = 0; i < palabraSecreta.length; i++) {
        //Pinto los espacios y le añado el ID con la posición de cada la letra
        document.getElementById('letras').innerHTML += `<p id="pos${i}" class="mx-2">-</p>`;
    }
}


//------PETICIÓN A LA API DE LA PALABRA SECRETA--------
function peticionAPI() {
    fetch(ApiUrl)
        .then(result => result.json())
        .then(answer => {
            palabraRandom = answer[0];
            // console.log(palabraRandom);
            pintarPalabra(palabraRandom);
        })
        .catch(err => console.error(err));
}

//---------CLICK -------CAPTURO LA LETRA --------
//Capturo el click de la letra seleccionada por su ID 
//que he pasado por parámetro cuando he dibujado los botones
function capturarLetra(i) {
    //Compruebo que me llega el ID por parámetro
    // console.log(i);
    let letra = document.getElementById(`${characters[i]}`).id;
    //Compruebo que me llega la letra que corresponde al ID
    // console.log(letra);
    //Cambio el aspecto del botón de la letra seleccionada y lo desactivo
    document.getElementById(`${characters[i]}`).disabled = true;
    //LLamo a la funcion para comprobar la letra pasándola por parámetro
    probarLetra(letra);
};


//-------------COMPRUEBO LAS LETRAS SELECCIONADAS------------
function probarLetra(letra) {
    //Creo una condición falsa de inicio
    let correcto = false;
    //Compruebo en cada iteración del bucle si la letra coincide con la de la palabra secreta
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] == letra) {
            //Si se cumple la condición cambio la variable correcto a true
            correcto = true;
            /*Llamo a la funcion pintarLetra pasándole la posicion de la letra 
            y la letra a la que corresponde*/
            pintarLetra(i, letra);
            //Reproduzco sonido de acierto
            cargarSonido(good);
            //Pinto el PNG de acierto
            document.getElementById('check').innerHTML = `<img src="img/correct.png" alt="" class="ms-2"></img>`;
        }
    }
    //Si la variable = no es correcto:
    if (!correcto) {
        //Incremento el número de fallos
        fallos++;
        //Reproduzco sonido de error
        cargarSonido(bad);
        //Pinto el PNG de error
        document.getElementById('check').innerHTML = `<img src="img/error.png" alt="" class="ms-2"></img>`;
        //Llamo a la función para pintar el ahorcado
        pintarAhorcado(fallos);
    } 
}

//--------NO ACIERTA---- PINTAR AHORCADO-------------
function pintarAhorcado(fallos) {
    //Cambio la imagen del ahorcado siguiendo el número de fallos
    //Cada imagen guardada va del 0 al 6
    document.getElementById('imgAhorcado').src = `img/ahorcado${fallos}.png`;
    //Cuando el contador de fallos llegue a 6 hago visible el mensaje de partida perdida
    if (fallos == 6) {
        //Habilito el mensaje perdedor
        document.getElementById('lose').className = 'text-white';
        //Activo sonido perdedor
        cargarSonido(looser);
        //Deshabilito el teclado
        for (let i = 0; i < characters.length; i++) {
            document.getElementById(`${characters[i]}`).disabled = true;
        }
        //Muestro la palabra Secreta desde el random por si lleva acento
        document.getElementById('letras').innerHTML = palabraRandom.toLocaleUpperCase();
        //La pinto de color rojo
        document.getElementById('letras').className = "justify-content-center d-flex mx-5 text-danger fw-bold";
        //Habilito el botón de START para volver a jugar
        document.getElementById('start').disabled = false;
    }
}

//--------ACIERTA---- PINTAR LETRA-------------
function pintarLetra(index, letra) {
    //Acumulo el número de aciertos
    aciertos++;
    //Reemplazo el guión con la letra correcta 
    //La extraigo de la palabraRandom por si tiene acentos y la paso a mayúscula
    let remplazar = palabraRandom[index].toLocaleUpperCase().replace(`"", ${letra}`);
    document.getElementById(`pos${index}`).innerHTML = remplazar;
    //Si el número de aciertos es igual al número de letras de la palabra secreta, ha ganado
    if (aciertos == palabraSecreta.length) {
        //Habilito el mensaje ganador
        document.getElementById('win').className = 'text-white';
        //Activo sonido ganador
        cargarSonido(winner);
        //Pinto la palabra secreta de color amarillo
        document.getElementById('letras').className = "justify-content-center d-flex mx-5 text-warning fw-bold";
        //Deshabilito el teclado
        for (let i = 0; i < characters.length; i++) {
            document.getElementById(`${characters[i]}`).disabled = true;
        }
        //Habilito el botón de START para volver a jugar
        document.getElementById('start').disabled = false;
    }
}

//---------INSERCIÓN DE AUDIO----------------
//Sonidos en mp3 en línea
let good = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/goodbell.mp3";
let bad = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/bad.mp3";
let winner = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/win.mp3";
let looser = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/lose.mp3";

//Función que reproduce el sonido
function cargarSonido(fuente) {
    //Creo una variable con el sonido y la url pasada por parámetro
    const sonido = new Audio(fuente);
    //Oculto el reproductor 
    sonido.style.display = "none";
    //Activo el autoplay
    sonido.setAttribute("autoplay", "true");
    //Lo añado al body aunque al estar oculto no se verá
    document.body.appendChild(sonido);
};