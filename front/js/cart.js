const localStorageCartKey = "p5_cartData";

let cartData = []

//obtenir des données de localStorage, s'il n'existe pas-définissez-le comme tableau vide 
// puis l'analyser-le
try {
  const savedCartData = localStorage.getItem(localStorageCartKey) || "[]";
  cartData = JSON.parse(savedCartData);

} catch (error) {

}

let totalQuantity = 0;
let totalSum = 0;
cartData.forEach(product => {

  fetch(`http://localhost:3000/api/products/${product.id}`)
    .then(response => response.json())
    .then(data => {

      document.querySelector("#cart__items").innerHTML += `
    <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
    <div class="cart__item__img">
      <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>${product.color}</p>
        <p>${data.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
  `

      createDeleteListener()
      createUpdateListener()

    })

})

getTotal()

const btn_Order = document.getElementById("order");
// console.log(btn_Order);

// button  //
btn_Order.addEventListener("click", (event) => {

  //  - si la forme est invalide-pas envoyer le demande!!!

  const ids = [];
  cartData.forEach(product => ids.push(product.id));

  fetch(`http://localhost:3000/api/products/order`, {
    method: 'POST',
    body: JSON.stringify({
      contact: {
        contact: '1', // remplire avec les donnees reel 
        firstName: '1', // remplire avec les donnees reel 
        lastName: '1', // remplire avec les donnees reel
        address: '1', // remplire avec les donnees reel 
        city: '1', // remplire avec les donnees reel 
        email: 'a@a', // remplire avec les donnees reel
      },
      products: ids
    }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }).then(success => {
    debugger;
    const a = success;
  }, error => {
    debugger;
    const a = error;

  });
  return false;


});
//--suppression de produit--//
function createDeleteListener() {

  document.querySelectorAll(".deleteItem").forEach(item => {
    item.addEventListener('click', () => {

      const id = item.closest('article').getAttribute('data-id')
      const color = item.closest('article').getAttribute('data-color')

      const oldCart = JSON.parse(localStorage.getItem('p5_cartData'))
      let newCart = []

      oldCart.forEach(product => {
        if (product.id != id || product.color != color) {
          newCart.push(product)
        }
      })

      localStorage.setItem('p5_cartData', JSON.stringify(newCart))

      item.closest('article').remove()
      getTotal()

    })
  })
}

function createUpdateListener() {

  document.querySelectorAll(".itemQuantity").forEach(item => {
    item.addEventListener('change', () => {

      const id = item.closest('article').getAttribute('data-id')
      const color = item.closest('article').getAttribute('data-color')

      const oldCart = JSON.parse(localStorage.getItem('p5_cartData'))
      let newCart = []

      oldCart.forEach(product => {
        if (product.id == id && product.color == color) {
          product.quantity = parseInt(item.value)
        }
        newCart.push(product)
      })

      localStorage.setItem('p5_cartData', JSON.stringify(newCart))

      getTotal()
    })
  })
}

function getTotal() {

  let panier = JSON.parse(localStorage.getItem('p5_cartData'))

  const quantity = document.querySelector('#totalQuantity')
  quantity.textContent = 0
  const total = document.querySelector('#totalPrice')
  total.textContent = 0

  panier.forEach(item => {
    fetch(`http://localhost:3000/api/products/${item.id}`)
      .then(response => response.json())
      .then(data => {

        quantity.textContent = Number(quantity.textContent) + item.quantity
        total.textContent = (Number(total.textContent) + (data.price * item.quantity)).toFixed(2)

      })
      .catch(err => console.log(err))
  })

}

//-----formulaire commande-------//--------//-------//---------//----------//-----------//

//---addEventListener---///
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
})

document.querySelector("#order").addEventListener("click", (e) => {
  
  e.preventDefault();

  let products = []

  JSON.parse(localStorage.getItem('p5_cartData')).forEach(product => {
    products.push(product.id)
  })

  //--les deonnées du formulaire dans l'objet--//
  const contact = {
    firstName: document.querySelector('#firstName').value,
    lastName: document.querySelector('#lastName').value,
    address: document.querySelector('#address').value,
    city: document.querySelector('#city').value,
    email: document.querySelector('#email').value,
  }

  const order = {
    contact,
    products
  }

  //Envoyer les données  du formulaire et le produit//
  let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
  let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
  
  if(products.length != 0){
    if(
      checkRegexp(contact.firstName, charRegExp, 'firstNameErrorMsg', 'Verifiez votre prénom.') &&
      checkRegexp(contact.lastName, charRegExp, 'lastNameErrorMsg', 'Verifiez votre nom.') &&
      checkRegexp(contact.address, addressRegExp, 'addressErrorMsg', 'Verifiez votre adresse.') &&
      checkRegexp(contact.city, charRegExp, 'cityErrorMsg', 'Verifiez votre Ville.') &&
      checkRegexp(contact.email, emailRegExp, 'emailErrorMsg', 'Verifiez votre email.')
    ){
      // Envoyer la commande
      fetch('http://localhost:3000/api/products/order', {
          method: 'POST',
          body: JSON.stringify(order),
          headers: {
              'Accept': 'application/json', 
              "Content-Type": "application/json" 
          },
      })
      .then(response => response.json())
      .then(data => {
        localStorage.removeItem('p5_cartData');
        window.location.href = `confirmation.html?orderId=${data.orderId}`
      })
      .catch(err => console.log(err))
    }
  } else{
    alert ('Vous ne pouvez pas passer de commande, votre panier est vide !')
  }


});

  function checkRegexp(content, regExp, errorId, errorMessage){
    let errorText = document.querySelector(`#${errorId}`)

    if (regExp.test(content)) {
      errorText.innerHTML = '';
      return true
    } else if(content == ''){
      errorText.innerHTML = 'Champs requis';
      return false
    } else {
      errorText.innerHTML = errorMessage;
      return false
    }
  }
