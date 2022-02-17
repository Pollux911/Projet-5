let cart = JSON.parse(localStorage.getItem('cartContent'));
console.table(cart);

const cartItems = document.getElementById('cart__items');

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

        console.log(element, 'lelement')
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
                console.log(e, 'suppression')
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


            console.log(price, 'le prix');*/
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
    console.log(inputDelete.item(index), ' = l index');
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
            console.log(itemButton, 'item bouton')
            console.log(article, ' l article');
            cart.splice(cartIndex, 1);
            localStorage.setItem('cartContent', JSON.stringify(cart));
            console.table(cart)*!/



        })
    })*/
}

form();

function form(){
    const regExpName = new RegExp('^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõú ùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]*$');
    const regExpAddress = new RegExp('^[a-zA-Z0-9.!#$%&áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]');
    const regExpEmail = new RegExp('^[a-zA-Z0-9.!#$%&áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$');


    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');


    firstName.addEventListener('change', (e) =>{

        if(!regExpName.test(e.target.value)){
            console.log('Prénom invalide');
            firstName.nextElementSibling.innerText = 'Prénom invalide';
        } else {
            firstName.nextElementSibling.innerText = ''
        }
    })

    lastName.addEventListener('change', (e) =>{
        if(!regExpName.test(e.target.value)){
            console.log('Nom invalide')
            lastName.nextElementSibling.innerText = 'Nom invalide';
        } else {
            lastName.nextElementSibling.innerText = ''
        }
    })

    address.addEventListener('change', (e) =>{
        if(!regExpAddress.test(e.target.value)){
            console.log('Adresse invalide')
            address.nextElementSibling.innerText = 'Adresse invalide';
        } else {
            address.nextElementSibling.innerText = ''
        }
    })
    city.addEventListener('change', (e) =>{
        if(!regExpName.test(e.target.value)){
            console.log('Ville invalide')
            city.nextElementSibling.innerText = 'Ville invalide';
        } else {
            city.nextElementSibling.innerText = ''
        }
    })

    email.addEventListener('change', (e) =>{
        if(!regExpEmail.test(e.target.value)){
            console.log('Email invalide')
            email.nextElementSibling.innerText = 'Email invalide';
        } else {
            email.nextElementSibling.innerText = ''
        }
    })

    const order = document.getElementById('order');
    order.addEventListener('click', (e) => {
            e.preventDefault();
            if (!email.nextElementSibling.innerText && !city.nextElementSibling.innerText
                && !address.nextElementSibling.innerText && !lastName.nextElementSibling.innerText
                && !firstName.nextElementSibling.innerText) {

                let products = [];
                let contact = {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    address: address.value,
                    city: city.value,
                    email: email.value
                }
                cart.forEach((element) =>{
                    products.push(element.id);
                })
                console.log(products, 'recap panier')

                let order = {contact, products}

                fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    body: JSON.stringify(order),
                    headers: {
                        "content-type" : "application/json",
                    }
                })
                    .then(function (res){
                        if(res.ok) {
                            return res.json();
                        } else {
                            console.log("error with API", res)
                        }
                    })
                    .then(function (data){
                        /*document.getElementById('orderID').innerText = data.orderId;*/
                        window.location = `./confirmation.html?id=${data.orderId}`;
                        console.log(data, 'data values');
                        console.log(data.orderId, 'l order id');

                })


            } else {
                alert('Veuillez remplir et vérifier tous les champs du formulaire ')
            }

    })
}
/*let url = new URL(window.location.href);
let orderId = url.searchParams.get("id");
document.getElementById('orderID').innerText = orderId;
console.log(orderId, 'l orderid pour la confirm')*/
