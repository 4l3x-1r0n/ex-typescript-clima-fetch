const container = document.querySelector(".container") as HTMLDivElement;
const resultado = document.querySelector("#resultado") as HTMLDivElement;
const formulario = document.querySelector("#formulario") as HTMLFormElement;

window.addEventListener("load", (arg) => {
    formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e: Event) {
    e.preventDefault();
    const ciudad = (document.querySelector("#ciudad") as HTMLInputElement).value;

    const pais = (document.querySelector("#pais") as HTMLInputElement).value;

    if (!ciudad || !pais) {
        showError("Ambos campos son abligatorios");
        return;
    }

    consultarAPI(ciudad, pais);
}


function showError(msg: string) {
    if (document.querySelector(".bg-red-100")) {
        return;
    }

    const alerta = document.createElement("div");

    alerta.classList.add("bg-red-100", "border-red-400", "text-red-400", "px-4", "py-3", "rounded", "max-w-md", "mx-auto", "mt-6", "text-center");

    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${msg}<span>
    `;
    container.append(alerta);
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

interface IOpenWeatherMapJsonResponse {
    cod: string;
    name: string;
    main: {
        temp: number;
        temp_max: number;
        temp_min: number;
    }
}

function consultarAPI(ciudad: string, pais: string) {
    const appId = "e0db83aca1cf1a2d87567316069c312a";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    spinner();

    fetch(url)
        .then((response) => response.json())
        .then((result) => showResult(result))
        .catch((error) => showError(error));
}


function showResult(data: IOpenWeatherMapJsonResponse) {
    limpiarHTML();
    if (data.cod === "404") {
        showError("Ciudad no encontrada");
        return;
    }

    //imprime la respuesta en el Html
    // destructuring de la propiedad main dentro del objeto result

    const { name, main: { temp, temp_max, temp_min } } = data;

    const centigrados = kelvinToCentigrados(temp);
    const maxCentigrados = kelvinToCentigrados(temp_max);
    const minCentigrados = kelvinToCentigrados(temp_min);

    const nombreciudad = document.createElement("p");
    nombreciudad.innerHTML = `Clima en ${name}`;
    nombreciudad.classList.add("font-bold", "text-2xl");

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451`;
    actual.classList.add("font-bold", "text-6xl");

    const tempMaxima = document.createElement("p");
    tempMaxima.innerHTML = `Max: ${maxCentigrados} &#8451`;
    tempMaxima.classList.add("text-xl");

    const tempMinima = document.createElement("p");
    tempMinima.innerHTML = `Min: ${minCentigrados} &#8451`;
    tempMinima.classList.add("text-xl");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");
    resultadoDiv.append(nombreciudad);
    resultadoDiv.append(actual);
    resultadoDiv.append(tempMaxima);
    resultadoDiv.append(tempMinima);

    resultado.append(resultadoDiv);
}

const kelvinToCentigrados = (grados: number) => (grados - 273.15).toFixed(0);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.firstChild.remove();
    }
}

function spinner() {

    limpiarHTML();
    const divSpinner = document.createElement("div");
    divSpinner.classList.add("sk-fading-circle");
    divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}
