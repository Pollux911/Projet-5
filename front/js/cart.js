let cart = JSON.parse(localStorage.getItem('cartContent'));
console.table(cart);

const cartItems = document.getElementById('cart__items');
/*let priceArray = []*/
let cartPrice = 0;
cart.forEach((element, index) => {
    fetch(`http://localhost:3000/api/products/${element.id}`)
        .then(function (res){
            if(res.ok) {
                return res.json();
            } else {
                console.log("error with API", res)
            }
        })
        .then(function (product){
            let apiProduct = createCartContent(product, cart[index])
            cartItems.appendChild(apiProduct);
            totalOfCart(product, cart[index]);
            /*priceArray.push(product.price);*/
        })
})

totalOfProducts();

function totalOfProducts(){
   const totalQuantity = document.getElementById('totalQuantity');
   let quantityArray = cart.map( v => v.quantity);
   totalQuantity.innerText = quantityArray.reduce((sum, current) => sum + current, 0) ;

}

function totalOfCart(product, cart){
    const totalPrice = document.getElementById('totalPrice');
    cartPrice += product.price *  cart.quantity;
    /*console.log('la qtt',product.price,'le price ', cart.price);*/
    console.log(cartPrice);
    totalPrice.innerText = cartPrice;
}





function createCartContent(product, cart) {
    const article = document.createElement('article');
    article.setAttribute('class', 'cart__item');
    article.setAttribute('data-id', product._id);
    article.setAttribute('data-color', cart.color);


    const itemImageDiv = document.createElement('div');
    itemImageDiv.setAttribute('class', 'cart__item__img');
    article.appendChild(itemImageDiv);

    const image = document.createElement('img');
    image.setAttribute('alt', product.altTxt + '');
    image.setAttribute('src', product.imageUrl)
    itemImageDiv.appendChild(image);

    const itemContentDiv = document.createElement('div');
    itemContentDiv.setAttribute('class', 'cart__item__content');
    article.appendChild(itemContentDiv);

    const itemDescriptionDiv = document.createElement('div');
    itemDescriptionDiv.setAttribute('class', 'cart__item__content__description');
    itemContentDiv.appendChild(itemDescriptionDiv);

    const productName = document.createElement('h2');
    productName.innerText = product.name;
    itemDescriptionDiv.appendChild(productName)

    const productColor = document.createElement('p')
    productColor.innerText = cart.color;
    itemDescriptionDiv.appendChild(productColor);

    const productPrice = document.createElement('p');
    productPrice.innerText = product.price + '€ * ' + cart.quantity + ' = ' + product.price *  cart.quantity + ' €'; /*Price * Quantity*/
    itemDescriptionDiv.appendChild(productPrice);

    const itemSettings = document.createElement('div');
    itemSettings.setAttribute('class', 'cart__item__content__settings');
    itemContentDiv.appendChild(itemSettings);

    const itemSettingsQuantity = document.createElement('div');
    itemSettingsQuantity.setAttribute('class', 'cart__item__content__settings__quantity');
    itemSettings.appendChild(itemSettingsQuantity);

    const itemQuantity = document.createElement('p');
    itemQuantity.innerText = 'Qté : ';
    itemSettingsQuantity.appendChild(itemQuantity);

    const quantityInput = document.createElement('input')
    quantityInput.setAttribute('type', 'number');
    quantityInput.setAttribute('class', 'itemQuantity');
    quantityInput.setAttribute('name', 'itemQuantity');
    quantityInput.setAttribute('min', '1');
    quantityInput.setAttribute('max', '100');
    quantityInput.setAttribute('value', cart.quantity);
    itemSettingsQuantity.appendChild(quantityInput);

    const itemSettingsDelete = document.createElement('div');
    itemSettingsDelete.setAttribute('class', 'cart__item__content__settings__delete');
    itemSettingsQuantity.appendChild(itemSettingsDelete);

    const itemDelete = document.createElement('p');
    itemDelete.setAttribute('class', 'deleteItem');
    itemDelete.innerText = 'Supprimer';
    itemSettingsDelete.appendChild(itemDelete);

    return article;
}


/*
changeQuantity();

function changeQuantity(){
    let inputQuantity = document.querySelectorAll('.itemQuantity')
    console.log(inputQuantity);
    inputQuantity.forEach((element) => {
        element.addEventListener('change', (e) => {
            let quantity = e.target.closest('');

            console.log(quantity);
        });

    })


}

*/

