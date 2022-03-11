//recuperer l'id
const querryString_url_id = window.location.search;

const urlSearchParams = new URLSearchParams(querryString_url_id);

const productId = urlSearchParams.get("id");

const localStorageCartKey = "p5_cartData";

//recuperer l'information sur le produit//


fetch(`http://localhost:3000/api/products/${productId}`)
    .then( response => response.json())
    .then( product => {

    document.querySelector('.item__img').innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
    document.querySelector('#title').textContent = product.name
    document.querySelector('#price').textContent = product.price
    document.querySelector('#description').textContent = product.description

    product.colors.forEach(item => {
        console.log(item)
        document.querySelector('#colors').innerHTML += `<option value="${item}">${item}</option>`
    })


    //----Le Panier---//
    //Récuperation des données //
    //ID selection //

    const colorSelect = document.querySelector("#colors");
    const quantityInput = document.querySelector("#quantity");


    //Button de panier selection //
    const btn_Panier = document.querySelector("#addToCart");
    console.log(btn_Panier);

    // button  //
    btn_Panier.addEventListener("click", (event)=>{
        event.preventDefault();
        //  sil'utilisateur rien selectioné
        if (!colorSelect.value || quantityInput.value == 0) {
            return;
        }
        //le Choix d'utilisateur var //
      
            //Recuperation des valeurs //
        let productOption = {
            id: productId,
            quantity: parseInt(quantityInput.value),
            color: colorSelect.value
        };

        let cartData = []
        
            //recupere les donnée de localStorage et defenire comme tableaux s'ils n'existent pas
            //puis l'analyse 
        try {
            const savedCartData = localStorage.getItem(localStorageCartKey) || "[]";
            cartData = JSON.parse(savedCartData);
            
        } catch (error) {
            
        }
        
        // si le produit est deja existe dans le panier -> augmenter la quantité
        let isExist = false;
        for (let index = 0; index < cartData.length; index++) {
            const product = cartData[index];
            if (product && product.id && product.color === productOption.color && product.id===productOption.id) {
                product.quantity = product.quantity ? product.quantity += productOption.quantity : productOption.quantity;
                isExist = true;
                break;
            }
        }

        // si non, ajouter
        if (!isExist) {
            cartData.push(productOption);
        }

        // sauvgarder dans localStorage
        localStorage.setItem(localStorageCartKey, JSON.stringify(cartData));


    });

});








