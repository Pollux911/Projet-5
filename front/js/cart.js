let confirmationRegex = new RegExp('confirmation')
let cartRegex = new RegExp('cart')

if(confirmationRegex.test(window.location.pathname)){ /*Check page's url to execute either confirmation script or cart script*/
    let url = new URL(window.location)
    document.getElementById('orderId').innerText = url.searchParams.get("id");

} else if (cartRegex.test(window.location.pathname)){

    let cart = JSON.parse(localStorage.getItem('cartContent'));
    console.table(cart);

    const cartItems = document.getElementById('cart__items');

    let cartPrice = 0;

    cart.forEach((element, index) => {/*Create html elements for every product in the cart*/
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
            })

    })


    totalOfProducts();

    function totalOfProducts(){/*Sum of products quantity in the cart*/
        const totalQuantity = document.getElementById('totalQuantity');
        let quantityArray = cart.map( v => v.quantity);
        totalQuantity.innerText = quantityArray.reduce((sum, current) => sum + current, 0) ;

    }

    function totalOfCart(product, cart){ /*Sum of cart price*/

        const totalPrice = document.getElementById('totalPrice');
        cartPrice += product.price *  cart.quantity;
        totalPrice.innerText = cartPrice;
        console.log(cartPrice, 'total du panier')
    }



    function createCartContent(product, cart) {/*Create HTML elements and add event listeners to quantity menu and delete button*/
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
        quantityInput.addEventListener('change', (e) => {
            changeQuantity(e)
        })

        const itemSettingsDelete = document.createElement('div');
        itemSettingsDelete.setAttribute('class', 'cart__item__content__settings__delete');
        itemSettingsQuantity.appendChild(itemSettingsDelete);

        const itemDelete = document.createElement('p');
        itemDelete.setAttribute('class', 'deleteItem');
        itemDelete.innerText = 'Supprimer';
        itemSettingsDelete.appendChild(itemDelete);
        itemDelete.addEventListener('click', (e) => {
            createDeleteButton(e);
        })

        return article;
    }




    function changeQuantity(e) {/*Change quantity value to input value and delete product if quantity = 0*/
        /*let priceRow = document.querySelectorAll('.cart__item__content p:nth-child(3)');*/ /*get the DOM element for the price*/
        let itemQuantity = e.target.closest('.itemQuantity');
        let article = e.target.closest('article');
        let productIndex = cart.findIndex((product) =>
            product.id === article.dataset.id &&
            product.color === article.dataset.color);
        console.log(productIndex, 'product index');
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
    }


    function recalculateCart(){/*after a modification, recalculate the sum of cart*/
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

    function deleteProduct(item, cartIndex){/*Delete product from local storage and from the page*/
        cart.splice(cartIndex, 1);
        item.remove();
        totalOfProducts();
        recalculateCart();
        localStorage.setItem('cartContent', JSON.stringify(cart));
    }

    function createDeleteButton(e) {
        let article = e.target.closest('article');
        let cartIndex = cart.findIndex((product) =>
            product.id === article.dataset.id &&
            product.color === article.dataset.color);
        deleteProduct(article, cartIndex);
    }



    form();

    function form(){/*Add event listener to all fields and check validity of inputs*/
        const regExpName = new RegExp('^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõú ùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]*$');
        const regExpAddress = new RegExp('^[a-zA-Z0-9.!#$%&áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]');
        const regExpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)


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
           let formClass = document.querySelector('.cart__order__form')

            if (!email.nextElementSibling.innerText && !city.nextElementSibling.innerText
                && !address.nextElementSibling.innerText && !lastName.nextElementSibling.innerText
                && !firstName.nextElementSibling.innerText && formClass.checkValidity()) {
                console.log(formClass.checkValidity(), ' check validity')
                e.preventDefault();
                sendOrderRequest(firstName, lastName, address, city, email);

            } else if(formClass.checkValidity()) {
                e.preventDefault();
                alert('Veuillez vérifier les champs du formulaire ')
            }
            else {
                alert('Veuillez remplir tous les champs du formulaire ')
            }

        })
    }

    function sendOrderRequest(firstName, lastName, address, city, email){/*Send the order request w/ forms inputs and local storage cart to the API*/
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
                window.location = `./confirmation.html?id=${data.orderId}`;

            })
    }
}








