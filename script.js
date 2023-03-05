let data = "";
let itinerarios = {};


let llamarSkyScanner = async (value) => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'ac74028f73mshf67ddc4572f009ap1d7a7djsn7c1d3c612a64',
      'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
    },
    body: JSON.stringify(value)
  };

  const response = await fetch('https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/create', options)




  if (response.status == 200) {

    data = await response.json();


    obtenerResultados();

    if (data != "") {
      tbody = document.querySelector("#resultados tbody");
      tbody.innerHTML = ""; // Vaciar la tabla antes de actualizarla
      const titulo_origen = document.getElementById("titulo_origen");
      let origen = document.getElementById("origen").value;
      console.log(origen);
      titulo_origen.innerHTML = `<p>Descubre las mejores ofertas para tu viaje desde: ${origen}</p>`;


      for (let itinerary in itinerarios) {
        const agencia = itinerarios[itinerary][0].join(", ");
        const precio = itinerarios[itinerary][1];
        const link = itinerarios[itinerary][2];
        const row = document.createElement("tr");
        row.innerHTML = `<td>${agencia}</td><td>${precio}€</td><td><a target="_blank" href="${link}">Link</td>`;
        tbody.appendChild(row);
      }

      const tabla = document.querySelector("#resultados");
      tabla.style.display = "table";
    }

    console.log(itinerarios);
  }

  else{
    const tit = document.querySelector("#resultados h2")
    tit.innerHTML = `Error en la petición`
  }
}


let obtenerResultados = () => {

  const itineraries = data.content.results.intineraries;

  for (let itinerary in itineraries) {
    const pricingOptions = itineraries[itinerary].pricingOptions;
    const agencias = pricingOptions[0].agentIds;
    const precios = (pricingOptions[0].price.amount);
    const items = pricingOptions[0].items;
    const link = items[0].deepLink;
    itinerarios[itinerary] = [agencias, precios, link];
  }
}

const validarYActualizar = (event) => {

  event.preventDefault();

  let origen = document.getElementById("origen").value;
  let pasajeros = parseInt(document.getElementById("num_pasajeros").value);
  let fecha = document.getElementById("fecha").value;

  const fechaPartes = fecha.split("-");
  const anio = parseInt(fechaPartes[0]);
  const mes = parseInt(fechaPartes[1]);
  const dia = parseInt(fechaPartes[2]);

  const objJson = {
    query: {
      market: "ES",
      locale: "es-ES",
      currency: "EUR",
      queryLegs: [
        {
          originPlaceId: {
            iata: origen
          },
          destinationPlaceId: {
            iata: "MAD"
          },
          date: {
            year: anio,
            month: mes,
            day: dia
          }
        }
      ],
      cabinClass: "CABIN_CLASS_ECONOMY",
      adults: pasajeros
    }
  }
  llamarSkyScanner(objJson);


}







