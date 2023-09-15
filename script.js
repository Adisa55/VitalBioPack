

/* Sorting
_________________________________________________________*/
const select = document.querySelector('.filter-sorting .sort select'); // Select the dropdown element
const productList = document.getElementById('product-list');
var productsData = [];
let productNumber = 0;

function sortProductList(option) {

    const products = productsData;

    if (option === 'LowHigh') {
        products.sort((a, b) => a.price - b.price);
    } else if (option === 'HighLow') {
        products.sort((a, b) => b.price - a.price);
    } else if (option === 'az') {
        products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'za') {
        products.sort((a, b) => b.name.localeCompare(a.name));
    }

    productList.innerHTML = '';
    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.className = 'product';

        listItem.innerHTML = `
              <img src="${product.image}" alt="">
              <div class="description">
                  <span>${product.description}</span>
                  <h4>${product.name}</h4>
                  <h3>${product.price} KM</h3>
              </div>
              <a href="" class="addcart" id="product-${product.id}">
                  <i class="fa-solid fa-cart-shopping cart" id="cart"></i>
                </a>
            `;
        listItem.setAttribute('data-filter', product.filter);

        productList.appendChild(listItem);
    });
}

if (productList != null) {
    select?.addEventListener('change', function () {
        sortProductList(this.value);
    });
    sortProductList('Default');
}



/* Filters
_________________________________________________________*/


const filters = document.querySelectorAll('.filters li');

function filterProducts(selectedFilter) {
    const products = productList.querySelectorAll('.product');
    products.forEach(product => product.style.display = (selectedFilter === 'All' || product.getAttribute('data-filter') === selectedFilter) ? 'block' : 'none');
    filters.forEach(filter => filter.classList.toggle('active', filter.getAttribute('data-filter') === selectedFilter));
}

filters.forEach(filter => filter.addEventListener('click', () => filterProducts(filter.getAttribute('data-filter'))));
if (productList != null) {
    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            productList.innerHTML = data.map(product => `
            <li class="product" data-filter="${product.filter}">
                <img src="${product.image}" alt="">
                <div class="description">
                    <span>${product.description}</span>
                    <h4>${product.name}</h4>
                    <h3>${product.price} KM</h3>
                </div>
                <a href="" class="addcart" id="product-${product.id}">
              <i class="fa-solid fa-cart-shopping cart" id="cart"></i>
            </a>
            </li>
            
        `).join('');
            productsData = data;
            filterProducts('All');
        }
        )
        .catch(error => console.error('Error fetching and parsing JSON:', error));


}

/* Search
_________________________________________________________*/


function performSearch() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    fetch("product.json")
        .then((response) => response.json())
        .then((data) => {
            productList.innerHTML = ''; // Clear the previous results

            data.forEach((product) => {
                let productName = product.name.toLowerCase();

                if (productName.includes(searchInput)) {
                    let productElement = document.createElement("li");
                    productElement.className = "product"; // Add the "product" class to the created element

                    // Create and append the product details to the product element
                    productElement.innerHTML = `
            
            <img src="${product.image}" alt="${product.name}">
            <div class="description">
                <span>${product.description}</span>
                <h4>${product.name}</h4>
                <h3>${product.price} KM</h3>
            </div>
            <a href="" class="addcart" id="product-${product.id}">
              <i class="fa-solid fa-cart-shopping cart" id="cart"></i>
            </a>
            `;

                    productList.appendChild(productElement);

                }
            });
        })
        .catch((error) => {
            console.error("Error fetching product data:", error);
        });
}
if (productList != null) {
    // Listen for "Enter" key press
    document.getElementById("search-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            performSearch();

        }
    });


    // Listen for input changes in the search input
    document.getElementById("search-input").addEventListener("input", () => {
        const searchInput = document.getElementById("search-input").value;

        // Check if the search input is empty
        if (!searchInput.trim()) {
            // Reload the page when the search input is empty
            location.reload();
        }
    });

    // Listen for click on the search icon
    document.getElementById("search").addEventListener("click", () => {
        performSearch();
    });
}





/* Cart
_________________________________________________________*/

function loadProductData() {

    fetch('product.json')
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = ''; // Clear the previous results

            products.forEach(product => {
                const productItem = document.createElement('li'); // Create list items for products
                productItem.classList.add('product'); // Add the 'product' class to each list item
                productItem.setAttribute('data-filter', product.filter);

                productItem.innerHTML = `
          <div class="allinfo">
            <img src="${product.image}" alt="${product.name}">
            <div class="description">
              <span>${product.description}</span>
              <h4>${product.name}</h4>
              <h3>${product.price} KM</h3>
            </div>
            <a href="javascript:void(0)" class="addcart" id="product-${product.id}">
              <i class="fa-solid fa-cart-shopping cart" id="cart"></i>
            </a>
          </div>
          `;

                // Append the product list item to the product list (UL)
                productList.appendChild(productItem);

                // Add click event listener to the "Add to Cart" button for each product

                const cartButton = productItem.querySelector('.addcart');
                cartButton.addEventListener('click', () => {
                    addToCart(product); // Pass the entire product object to addToCart
                    totalPrice(product);
                });

            });
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
}

// Function to handle adding a product to the cart
function addToCart(product) {
    let productNumber = localStorage.getItem('cartNumber');
    productNumber = parseInt(productNumber) || 0;

    // Increment the cart count
    productNumber++;
    localStorage.setItem('cartNumber', productNumber);

    // Update the cart icon or count display
    document.querySelector('.icons span').textContent = productNumber;

    // You can also perform other cart-related actions here if needed
    loadProductData();
    setItems(product);
}

function loadCartProductNumber() {
    productNumber = localStorage.getItem('cartNumber');

    if (productNumber) {
        document.querySelector('.icons span').textContent = productNumber;

    }
}


function setItems(product) {
    let cartItem = localStorage.getItem("itemsInCart");
    cartItem = JSON.parse(cartItem);

    if (cartItem != null) {

        if (cartItem[product.id] == undefined) {
            cartItem = {
                ...cartItem,
                [product.id]: product
            }
        }
        cartItem[product.id].inCart += 1;
    }
    else {
        product.inCart = 1;
        cartItem = {
            [product.id]: product
        }
    }

    localStorage.setItem("itemsInCart", JSON.stringify(cartItem));
}

function totalPrice(product) {

    let cartPrice = localStorage.getItem("totalPrice");

    if (cartPrice != null) {
        cartPrice = parseFloat(cartPrice);
        localStorage.setItem("totalPrice", cartPrice + product.price)
    }
    else {
        localStorage.setItem("totalPrice", product.price);
    }

}




function cartDisplay() {
    let cartItem = localStorage.getItem("itemsInCart");
    cartItem = JSON.parse(cartItem);

    let cartProduct = document.querySelector(".cart-products");
    let cartPrice = localStorage.getItem("totalPrice");

    if (cartItem && cartProduct) {
        cartProduct.innerHTML = ''; // Clear the previous cart items
        cartProduct.innerHTML += `
        <div class="products-head">
        <h4 class="bin">Remove</h4>
        <h4 class="image">Image</h4>
        <h4 class="name">Name</h4>
        <h4 class="price">Price</h4>
        <h4 class="quan">Quantity</h4>
        <h4 class="subtotal">Subtotal</h4>
        </div> <br>`;
        Object.values(cartItem).map(item => {
            cartProduct.innerHTML += `
                <div class="products-body"> 
                    <i class="fa-solid fa-trash bin"></i>
                    <img class="image" src="${item.image}"/>
                    <h4 class="name">${item.name}</h4>
                    <h3 class="price">${item.price} KM</h3>
                    <div class="quan">
                        <i class="fa-regular fa-circle-down decrease"></i>
                        <span class="quantity">${item.inCart}</span>  
                        <i class="fa-regular fa-circle-up increase"></i>
                    </div>
                    <h4 class="subtotal">${item.inCart * item.price} KM</h4>
                </div>
                
            `;
        });


        let shippingCost = 0
        if (parseFloat(cartPrice) >= 100) {
            shippingCost = 0;
        }
        else {
            shippingCost = 8;
        }

        if (productNumber == 0) {
            cartProduct.innerHTML += `
            <div> 
            <h4 class="empty"> The cart is empty...</h4>
            <h4 class="back"> Back to <a href="Products.html">Products</a></h4>
            </div>
        `;
        }
        else {
            // Include the total price section within cartProduct
            cartProduct.innerHTML += `
            <div class="cartTotal"> 
            <h4 class="totalcost"> Total price: ${cartPrice} KM</h4>
            <h4 class="shipping"> Shipping: ${shippingCost} KM</H4>
            <h4 class="total"> Total: ${parseFloat(cartPrice) + shippingCost} KM</H4>
            </div>
        `;
        }

        // Add a single event listener to the cartProduct container
        cartProduct.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('increase')) {
                const quantityElement = target.parentNode.querySelector('.quantity');
                const index = Array.from(cartProduct.querySelectorAll('.increase')).indexOf(target);
                updateCartItem(cartItem, index, 1, null);
                quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
            } else if (target.classList.contains('decrease')) {
                const quantityElement = target.parentNode.querySelector('.quantity');
                const index = Array.from(cartProduct.querySelectorAll('.decrease')).indexOf(target);
                const currentQuantity = parseInt(quantityElement.textContent);
                if (currentQuantity > 1) {
                    updateCartItem(cartItem, index, -1, null);
                    quantityElement.textContent = currentQuantity - 1;
                }
            } else if (target.classList.contains('bin')) {
                const productBody = target.closest('.products-body');
                const quantityElement = target.parentNode.querySelector('.quantity');
                const currentQuantity = parseInt(quantityElement.textContent);
                const index = Array.from(cartProduct.querySelectorAll('.products-body')).indexOf(productBody);
                // Remove the item from the cartItem object directly
                updateCartItem(cartItem, index, currentQuantity * (-1), productBody);


            }
        });
    }

}

// Add this function to update the cart item
function updateCartItem(cartItem, index, change, productBody) {
    const keys = Object.keys(cartItem);
    const productId = keys[index];
    const product = cartItem[productId];

    // Update the cart item in the local storage
    product.inCart += change;

    localStorage.setItem('cartNumber', parseInt(localStorage.getItem('cartNumber')) + parseInt(change));
    loadCartProductNumber();
    localStorage.setItem("itemsInCart", JSON.stringify(cartItem));

    // Update the subtotal
    const subtotalElement = document.querySelectorAll(".subtotal")[index];
    subtotalElement.textContent = `${product.inCart * product.price} KM`;

    // Update the total price
    const totalPriceElement = document.querySelector(".totalcost");
    let totalPrice = parseFloat(localStorage.getItem("totalPrice"));
    totalPrice += change * product.price;
    localStorage.setItem("totalPrice", totalPrice);
    totalPriceElement.textContent = `Total price:${totalPrice} KM`;

    if (productBody != null) {
        const keys = Object.keys(cartItem);
        const productId = keys[index];
        delete cartItem[productId];
        // Update the local storage
        localStorage.setItem("itemsInCart", JSON.stringify(cartItem));

        // Update the cart display
        productBody.remove();
    }
    cartDisplay();
}
if (productList != null) {
    loadProductData();
}

loadCartProductNumber();
cartDisplay();




