let url = new URL(window.location.href);
let productId = url.searchParams.get("id");


console.log(productId);

fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (res){
        if(res.ok) {
            return res.json();
        } else {
            console.log("error with API", res);
        }
    })
    .then(function (apiData){
       showProduct(apiData);
    })
    .catch(function(err) {
        console.log("error with the API", err)
    });

function showProduct(product) { /* display product w/ API data*/
    const itemImage = document.querySelector(".item__img");

    const image = document.createElement('img');
    image.setAttribute('alt', product.altTxt + '');
    image.setAttribute('src', product.imageUrl);
    itemImage.appendChild(image);

    const title = document.getElementById('title');
    title.innerText = product.name;

    const price = document.getElementById('price');
    price.innerText = product.price;

    const description = document.getElementById('description');
    description.innerText = product.description;

    for(let color of product.colors){/*create every color options for product*/
        createColor(color);
    }

}

function createColor(color){ /* add color option to the select menu*/
    const colors = document.getElementById("colors");

    let option = document.createElement('option')
    option.setAttribute('value', color);
    option.innerText = color;

    colors.appendChild(option);
}
let cart = []

function addToCart() {

    let cartStorage = localStorage.getItem('products');

    cart.id = productId;

    cart.quantity = document.getElementById('quantity').value;

    cart.color = document.getElementById('colors').value;

    localStorage.setItem('products', JSON.stringify(cart));

    console.log(localStorage.getItem('products'));

    for(product of cartStorage){

    }

}

let cartButton = document.getElementById('addToCart');
cartButton.addEventListener('click', function (){
    addToCart();
});




