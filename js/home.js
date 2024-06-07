const main = () => {
  loadGet()

  window.addEventListener('click', async (e) => {
    if (e.target.className == "cards-article-top") {
      localStorage.setItem('id-event', e.target.id)
      document.location.href = "/Front-end/pages/view-event.html";
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

// Get que utiliza as funçoes: search() e passa os dados por loop ao createElements()
export const loadGet = async () => {
  const dataJson = await search(`http://localhost:5001/events/`);
  if (dataJson != undefined) {
    dataJson.events.forEach(async (element) => {
      const address = await search(`http://viacep.com.br/ws/${element.cep}/json/`);
      const final = `${address.logradouro}, ${element.place_number} - ${address.bairro}, ${address.localidade} - ${address.uf}`;
      createElements(element, final);
    });
  }
}

// Faz um fetch na API com a url que for recebida
const search = async (urlParams) => {
  let url = urlParams;
  const response = await fetch(url);
  const data = await response.json();
  if (data != undefined) return data;
}

// Função que declara e insere os elementos no HTML
const createElements = (element, final) => {
  const container = document.getElementById('main-container'); // Container principal

  // Criando elementos
  const cardArticle = document.createElement('article');
  const cardArticleTop = document.createElement('div');
  const imgContainer = document.createElement('div');
  const img = document.createElement('img');

  const dataContainer = document.createElement('div');
  const nameEvent = document.createElement('h1');
  const typeEvent = document.createElement('h2');
  const dateEvent = document.createElement('h2');
  const addressEvent = document.createElement('h3');

  const aButton = document.createElement('a');
  const checkMore = document.createElement('p');

  // Texto
  const nameEventText = document.createTextNode(element.name);
  const typeEventText = document.createTextNode("Tipo: " + element.type);
  const dateEventText = document.createTextNode("Data: " + element.date);
  const addressEventText = document.createTextNode(final); // fetch no viacep
  const checkMoreText = document.createTextNode("clique para mais informações");

  nameEvent.appendChild(nameEventText);
  typeEvent.appendChild(typeEventText);
  dateEvent.appendChild(dateEventText);
  addressEvent.appendChild(addressEventText);
  checkMore.appendChild(checkMoreText);

  // Classes
  cardArticle.setAttribute('class', 'cards-article');
  cardArticleTop.setAttribute('class', "cards-article-top")
  imgContainer.setAttribute('class', "image-container");
  dataContainer.setAttribute('class', "article-data");

  // ID
  cardArticleTop.setAttribute('id', element._id);

  // SRC
  img.setAttribute('src', `http://localhost:5001/${element.file}`);

  // Setando os textos alternativos das imagens
  img.setAttribute('alt', 'Imagem do evento');

  // Criando o card no HTML
  container.appendChild(cardArticle)
  cardArticle.appendChild(imgContainer);
  cardArticle.appendChild(cardArticleTop)
  imgContainer.appendChild(img);

  cardArticle.appendChild(dataContainer);
  dataContainer.appendChild(nameEvent);
  dataContainer.appendChild(typeEvent);
  dataContainer.appendChild(dateEvent);
  dataContainer.appendChild(addressEvent);
  dataContainer.appendChild(aButton);
  aButton.appendChild(checkMore);
}

main();
