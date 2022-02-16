let cart = JSON.parse(localStorage.getItem('cartContent'));
console.table(cart);

const cartItems = document.getElementById('cart__items');

let cartPrice = 0;
/*let priceArray= [];*/

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

                /*changeQuantity();
                deleteButton();*/
            })
            .then(function (){
                createDeleteButton(index);
                changeQuantity(index);
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
    /*console.log(cartPrice);*/
    totalPrice.innerText = cartPrice;
    console.log(cartPrice, 'total du panier')
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
    /*productPrice.setAttribute('data-price', product.price);*/
    productPrice.innerText = product.price + '€' /*'€ * ' + cart.quantity + ' = ' + product.price * cart.quantity + ' €'*/;
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




function changeQuantity(index) {

    let inputQuantity = document.querySelectorAll('.itemQuantity');

    /*let priceRow = document.querySelectorAll('.cart__item__content p:nth-child(3)');*/ /*get the DOM element for the price*/

    console.log(inputQuantity.item(index), 'l index de la nodelist');
    inputQuantity.item(index).addEventListener('change', (e) => {
        let itemQuantity = e.target.closest('.itemQuantity');
        let article = e.target.closest('article')
        let productIndex = cart.findIndex((product) =>
            product.id === article.dataset.id &&
            product.color === article.dataset.color);
        cart[productIndex].quantity = itemQuantity.valueAsNumber;
        console.log(itemQuantity.valueAsNumber, '   quantité modifié');

        if (cart[productIndex].quantity === 0) {
            deleteProduct(article, productIndex)
            console.log(e, 'quantité a 0 => suppression')
            return
        }
        totalOfProducts();
        recalculateCart();
        localStorage.setItem('cartContent', JSON.stringify(cart));

    });
}

    /*inputQuantity.forEach((element) => { old change quantity

        console.log(element, 'c koi lelem')
        element.addEventListener('change', (e) => {
            let itemQuantity = e.target.closest('.itemQuantity');
            let article = e.target.closest('article')
            let productIndex= cart.findIndex((product) =>
                             product.id === article.dataset.id &&
                             product.color === article.dataset.color);
            cart[productIndex].quantity = itemQuantity.valueAsNumber;
            console.log(itemQuantity.valueAsNumber, '   quantité modifié');

            if(cart[productIndex].quantity === 0){
                deleteProduct(article, productIndex)
                console.log(e, 'alerte')
                return
            }
            totalOfProducts();
            recalculateCart();
            localStorage.setItem('cartContent', JSON.stringify(cart));})
    })*/


            /*fetch(`http://localhost:3000/api/products/${cart[productIndex].id}`) /!*Get price from API*!/
                .then(function (res){
                    if(res.ok) {
                        return res.json();
                    } else {
                        console.log("error with API", res);
                    }
                })
                .then(function (product){
                    priceRow[productIndex].innerText = product.price + '€ * ' + cart[productIndex].quantity
                        + ' = ' + product.price * cart[productIndex].quantity + ' €';
                    return product.price
            })*/

            /*let price = priceRow[productIndex].dataset.price; /!*get Price from DOM*!/
            priceRow[productIndex].innerText = price + '€ * ' + cart[productIndex].quantity
                + ' = ' + price * cart[productIndex].quantity + ' €';


            console.log(price, 'ui');*/
        /*});*/


function recalculateCart(){
    const totalPrice = document.getElementById('totalPrice');
    let cartPrice = 0
    if (cart.length === 0){
        totalPrice.innerText = cartPrice;
        setTimeout(() => {window.alert("Votre panier est vide!"); }, 100)
    } else (cart.forEach((element, index) => {
        fetch(`http://localhost:3000/api/products/${element.id}`)
            .then(function (res){
                if(res.ok) {
                    return res.json();
                } else {
                    console.log("error with API", res)
                }
            })
            .then(function (product){
                cartPrice += product.price *  cart[index].quantity;
                totalPrice.innerText = cartPrice;
            })
    }))

}

function deleteProduct(item, cartIndex){
    cart.splice(cartIndex, 1);
    item.remove();
    totalOfProducts();
    recalculateCart();
    localStorage.setItem('cartContent', JSON.stringify(cart));
}

function createDeleteButton(index){

    let inputDelete = document.querySelectorAll('.deleteItem');
    let deleteButton = inputDelete.item(index);
    console.log(inputDelete.item(index), 'l index de ses morts');
    deleteButton.addEventListener('click', (e) => {
        let article = e.target.closest('article');
        let cartIndex = cart.findIndex((product) =>
            product.id === article.dataset.id &&
            product.color === article.dataset.color);
       /* console.log(article, 'larticle')
        console.log(cartIndex, ' lindex du cart');*/
        deleteProduct(article, cartIndex);
    })

    /*inputDelete.forEach((element) => { old delete product

        element.addEventListener('click', (e) => {
            let article = e.target.closest('article');
            let cartIndex= cart.findIndex((product) =>
                product.id === article.dataset.id &&
                product.color === article.dataset.color);
            console.log(article, 'larticle')
            console.log(cartIndex, ' lindex du cart');
            deleteProduct(article, cartIndex);

            /!*let itemButton = e.target.closest('[data-id]')
            let article = e.target.closest('article')
            let cartIndex= cart.findIndex((product) =>
                product.id === article.dataset.id &&
                product.color === article.dataset.color);
            console.log(itemButton, 'alors')
            console.log(article, 'le truc clic');
            cart.splice(cartIndex, 1);
            localStorage.setItem('cartContent', JSON.stringify(cart));
            console.table('did it work ?', cart)*!/



        })
    })*/
}


