
/* HideShowPassword
_________________________________________________________*/

const form = document.querySelector(".form"),
    iShowHide = document.querySelectorAll(".icon-eye"),
    links = document.querySelectorAll(".link");

iShowHide.forEach(iconEye => {
    iconEye.addEventListener("click", () => {
        let fields = iconEye.parentElement.parentElement.querySelectorAll(".password");

        fields.forEach(password => {
            if (password.type === "password") {
                password.type = "text";
                iconEye.classList.replace("fa-eye-slash", "fa-eye");
                return;
            }
            password.type = "password";
            iconEye.classList.replace("fa-eye", "fa-eye-slash");
        })
    })

})



/* Sorting
_________________________________________________________*/

const select = document.getElementById('select');
const productList = document.getElementById('product-list');
var productsData = [];
let carts = [];

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
// Event listener for the select element
select.addEventListener('change', function () {
    sortProductList(this.value);
});

sortProductList('Default');




/* Filters
_________________________________________________________*/


const filters = document.querySelectorAll('.filters li');

function filterProducts(selectedFilter) {
    const products = productList.querySelectorAll('.product');
    products.forEach(product => product.style.display = (selectedFilter === 'All' || product.getAttribute('data-filter') === selectedFilter) ? 'block' : 'none');
    filters.forEach(filter => filter.classList.toggle('active', filter.getAttribute('data-filter') === selectedFilter));
}

filters.forEach(filter => filter.addEventListener('click', () => filterProducts(filter.getAttribute('data-filter'))));

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



/* Numbers
_________________________________________________________*/



/* Cart
_________________________________________________________*/

function loadProductData() {

    let productNumber = localStorage.getItem('cartNumber');

    if(productNumber){
        document.querySelector('.icons span').textContent = productNumber;

    }

    fetch('product.json')
      .then(response => response.json())
      .then(products => {
        productList.innerHTML = ''; // Clear the previous results
  
        products.forEach(product => {
          const productItem = document.createElement('li'); // Create list items for products
          productItem.classList.add('product'); // Add the 'product' class to each list item
  
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
    console.log(`My product is:`, product);
  }
  
  
  loadProductData();
  
  


  