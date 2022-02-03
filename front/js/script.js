fetch("http://localhost:3000/api/products")
    .then(function (res){
        if(res.ok) {
            return res.json();
        } else {
            console.log("error with API", res)
        }
    })
    .then(function(apiData){
        const items = document.getElementById('items');
        for(let product of apiData) {
            let apiProduct = createProduct(product);
            items.appendChild(apiProduct);
        }
    })
    .catch(function(err) {
        console.log("error with the API", err)
    });

function createProduct(product) {
    const link = document.createElement('a');
    link.setAttribute('href', `./product.html?id=${product._id}`);

    const article = document.createElement('article');

    const image = document.createElement('img');
    image.setAttribute('alt', product.altTxt + '');
    image.setAttribute('src', product.imageUrl)
    article.appendChild(image);

    const productName = document.createElement('h3');
    productName.classList.add('productName')
    productName.innerText = product.name;
    article.appendChild(productName)

    const productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.innerText = product.description;
    article.appendChild(productDescription);

    link.appendChild(article);

    return link
}

