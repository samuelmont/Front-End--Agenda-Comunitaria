const main = async() => {
  const idEvent = localStorage.getItem('id-event');
  if (!idEvent) return document.location.href = '/Front-end/login-signin.html';
  await loadGet(idEvent);

  window.addEventListener('click', async (e) => {
    if(e.target.className == "enter-event") {
      const token = localStorage.getItem('token');
      if(!token) return alert("Você precisa estar logado");
      const enterEvent = await enterAPI(`http://localhost:5001/events/enter`, idEvent, token);

      if(enterEvent.errors) return enterEvent.errors.forEach((e) => alert(e));

      if (enterEvent.events.acknowledged == true){
        localStorage.removeItem('id-event');
        alert("Voce esta participando do evento");
        document.location.href = '/Front-end/pages/home.html';
      }
    }
    if (e.target.id == "menu-button") {
      const menu = document.getElementById("menu");
      menu.style.display = 'flex';
    }
    if (e.target.id == "button-menu") {
      const menu = document.getElementById("menu");
      menu.style.display = 'none';
    }
  })
}

const loadGet = async (idEvent) => {
  const dataJson = await searchAPI(`http://localhost:5001/events/one`, idEvent);
  if (dataJson != undefined) {
    const address = await searchViaCep(`http://viacep.com.br/ws/${dataJson.events.cep}/json/`);
    const final = `${address.logradouro}, ${dataJson.events.place_number} - ${address.bairro}, ${address.localidade} - ${address.uf}`;
    createElements(dataJson.events, final);
  }
}

const enterAPI = async (urlParams, idEvent, token) => {
  console.log(token, idEvent)
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: idEvent })
  };

  let url = urlParams;
  const response = await fetch(url, options);
  const data = await response.json();
  if (data.events.acknowledged == true){
    return data;
  }
  return data.errors = ["Erro ao conectar ao banco"];
}

const searchViaCep = async (urlParams) => {
  let url = urlParams;
  const response = await fetch(url);
  const data = await response.json();
  if (data != undefined) return data;
  alert("Erro ao pegar os dados de endereço");
}

// Faz um fetch na API com a url que for recebida
const searchAPI = async (urlParams, idEvent) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: idEvent })
  };

  let url = urlParams;
  const response = await fetch(url, options);
  const data = await response.json();
  if (data != undefined){
    localStorage.setItem('id-event', data.events._id);
    return data;
  }
  alert("Erro ao pegar os dados na API");
}

// Função que declara e insere os elementos no HTML
const createElements = (element, final) => {
  const container = document.getElementById('main-container'); // Container principal

  // Criando elementos
  const cardArticle = document.createElement('article');//
  const imgContainer = document.createElement('span');//
  const img = document.createElement('img');//

  const dataContainer = document.createElement('div');//
  const nameEvent = document.createElement('h1');//
  const typeEvent = document.createElement('h2');//
  const descEvent = document.createElement('p');
  const reqEvent = document.createElement('p');
  const addressEvent = document.createElement('h2');//
  const contactEvent = document.createElement('h2');
  const dateEvent = document.createElement('h2');//

  const buttonEvent = document.createElement('button');//

  // Texto
  const nameEventText = document.createTextNode(element.name);
  const typeEventText = document.createTextNode("Tipo: " + element.type);
  const descEventText = document.createTextNode(element.description);
  const reqEventText = document.createTextNode(element.requisites);
  const addressEventText = document.createTextNode(final); // fetch no viacep
  const contactEventText = document.createTextNode(element.contact_number);
  const dateEventText = document.createTextNode("Data: " + element.date);

  const buttonEventText = document.createTextNode("Participar do evento");

  nameEvent.appendChild(nameEventText);
  typeEvent.appendChild(typeEventText);
  descEvent.appendChild(descEventText);
  reqEvent.appendChild(reqEventText);
  addressEvent.appendChild(addressEventText);
  contactEvent.appendChild(contactEventText)
  dateEvent.appendChild(dateEventText);

  buttonEvent.appendChild(buttonEventText);

  // ID
  cardArticle.setAttribute('id', 'card-article');
  imgContainer.setAttribute('id', "image-container");
  dataContainer.setAttribute('id', "data-container");

  buttonEvent.setAttribute("class", "enter-event");
  buttonEvent.setAttribute("id", element._id);

  // SRC
  img.setAttribute('src', `http://localhost:5001/${element.file}`);

  // Setando os textos alternativos das imagens
  img.setAttribute('alt', 'Imagem do evento');

  // Criando o card no HTML
  cardArticle.appendChild(imgContainer);
  container.appendChild(cardArticle);
  imgContainer.appendChild(img);


  cardArticle.appendChild(dataContainer);
  dataContainer.appendChild(nameEvent);
  dataContainer.appendChild(typeEvent);
  dataContainer.appendChild(descEvent);
  dataContainer.appendChild(reqEvent);
  dataContainer.appendChild(addressEvent);
  dataContainer.appendChild(dateEvent);

  container.appendChild(buttonEvent);
}

main();
