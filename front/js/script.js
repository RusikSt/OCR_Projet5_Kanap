fetch("http://localhost:3000/api/products")
.then(res => res.json())
.then(data => {
  
  console.log(data);
//affichage de produit// 
  let items = '';
  data.forEach(kanap => {
    items += `
    <a href="./product.html?id=${kanap._id}">
          <article class=product>
            <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
            <h3 class="productName">${kanap.name}</h3>
            <p class="productDescription">${kanap.description}</p>
          </article>
        </a>
    `


    
  }),

  document.getElementById("items").innerHTML = items
  
  
  


})
l