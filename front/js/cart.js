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
document.querySelector("#order").addEventListener("click", (e) => {
  
  e.preventDefault();

  //--les deonnées du formulaire dans l'objet--//
  const formulaire = {
    firstName: document.querySelector('#firstName').value,
    lastName: document.querySelector('#lastName').value,
    address: document.querySelector('#address').value,
    city: document.querySelector('#city').value,
    email: document.querySelector('#email').value,
  }

  // Faire une condition qui vérifie la bonne intégriter des champs du formulaire avec REGEXP
  function getFormulaire() {
    //les Regex
    let form = document.querySelector(".cart__order__form");
    // Expression regulier
     let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
     let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
     let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
       
    //--Ecouter les modification//
    form.firstName.addEventListener('change', function() {
        validFirstName(this);
    });

    
    form.lastName.addEventListener('change', function() {
        validLastName(this);
    });

    
    form.address.addEventListener('change', function() {
        validAddress(this);
    });

    
    form.city.addEventListener('change', function() {
        validCity(this);
    });

    
    form.email.addEventListener('change', function() {
        validEmail(this);
    });

    //validation du prénom
    const validFirstName = function(inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;

        if (charRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        } else {
            firstNameErrorMsg.innerHTML = 'Veuillez remmplire ce champ par les données corrects.';
        }
    };

    //validation du nom
    const validLastName = function(inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (charRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez remmplire ce champ par les données corrects.';
        }
    };

    //validation de l'adresse
    const validAddress = function(inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        } else {
            addressErrorMsg.innerHTML = 'Veuillez remmplire ce champ par les données corrects.';
        }
    };

    //validation de la ville
    const validCity = function(inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (charRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        } else {
            cityErrorMsg.innerHTML = 'Veuillez remmplire ce champ par les données corrects.';
        }
    };

    //validation de l'email
    const validEmail = function(inputEmail) {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMsg.innerHTML = '';
        } else {
            emailErrorMsg.innerHTML = 'Veuillez remmplire ce champ par les données corrects.';
        }
    };
     
  }
  getFormulaire()
  //Envoyer les données  du formulaire et le produit//
 
  
});
function postFormulare(){
  const btn_commander = document.getElementById("order");

  //Ecouter le panier
  btn_commander.addEventListener("click", (event)=>{
  
      //Récupération des données du formulaire 
      let inputName = document.getElementById('firstName');
      let inputLastName = document.getElementById('lastName');
      let inputAdress = document.getElementById('address');
      let inputCity = document.getElementById('city');
      let inputMail = document.getElementById('email');
 
      let idProducts = [];
      for (let i = 0; i<produitLocalStorage.length;i++) {
          idProducts.push(produitLocalStorage[i].idProduit);
      }
      console.log(idProducts);

      const order = {
          contact : {
              firstName: inputName.value,
              lastName: inputLastName.value,
              address: inputAdress.value,
              city: inputCity.value,
              email: inputMail.value,
          },
          products: idProducts,
      } 

      const options = {
          method: 'POST',
          body: JSON.stringify(order),
          headers: {
              'Accept': 'application/json', 
              "Content-Type": "application/json" 
          },
      };

      fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);

          document.location.href = "confirmation.html";
      })
      .catch((err) => {
          alert ("Problème avec fetch : " + err.message);
      });
      })

}

postFormulare();