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

function showProduct(product) { /* Display product w/ API data*/
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

    for(let color of product.colors){/*Create every color options for product*/
        createColor(color);
    }

}

function createColor(color){ /* Add color option to the select menu*/
    const colors = document.getElementById("colors");

    let option = document.createElement('option')
    option.setAttribute('value', color);
    option.innerText = color;

    colors.appendChild(option);
}



function addToCart() {/*Add item to cartContent in localStorage*/

    let cartStorage = JSON.parse(localStorage.getItem('cartContent'));
    let quantity = parseInt(document.getElementById('quantity').value);
    let color = document.getElementById('colors').value;
    if(!cartStorage){
        let cart = {
            id : productId,
            quantity : quantity,
            color : color
        }
        localStorage.setItem('cartContent', JSON.stringify([cart]));
    }else {
        let alreadyExist = false;
        cartStorage.forEach((element, index) => {
            if(element.id === productId && element.color === color){
                cartStorage[index].quantity += quantity;
                localStorage.setItem('cartContent', JSON.stringify(cartStorage));
                return alreadyExist = true;
            }
        })
        if(!alreadyExist){
            cartStorage.push({
                id : productId,
                quantity : quantity,
                color : color
            })
            localStorage.setItem('cartContent', JSON.stringify(cartStorage));
        }
    }



}


document.getElementById('addToCart').disabled = true;

function isProductValid(){/*Check if selected product is valid (a color is selected or quantity > 0 )*/
    let colorOption = document.getElementById('colors').value;
    let quantity = document.getElementById('quantity').value;
    document.getElementById('addToCart').disabled = !colorOption || quantity === '0';
    /*alert('Veuillez saisir une quantité et une couleur valide')*/
}

let inputQuantity = document.getElementById('quantity');
inputQuantity.addEventListener('input', (e) =>{
    if (e.target.value <= 0){
        e.target.value = 1;
    }
    if (e.target.value > 100){
        e.target.value = 100;
    }
    isProductValid();
})

let colorSelect = document.getElementById('colors');
colorSelect.addEventListener('input', () => {
    isProductValid();
})


let cartButton = document.getElementById('addToCart');
cartButton.addEventListener('click', function (){
    addToCart();
    console.log(localStorage.getItem('cartContent'))
});




