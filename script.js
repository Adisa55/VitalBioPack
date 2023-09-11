
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
          <a><i class="fa-regular fa-heart heart"></i></a>
          <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
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
const productlist = document.querySelector('.product-list');

function filterProducts(selectedFilter) {
    const products = productlist.querySelectorAll('.product');
    products.forEach(product => product.style.display = (selectedFilter === 'All' || product.getAttribute('data-filter') === selectedFilter) ? 'block' : 'none');
    filters.forEach(filter => filter.classList.toggle('active', filter.getAttribute('data-filter') === selectedFilter));
}

filters.forEach(filter => filter.addEventListener('click', () => filterProducts(filter.getAttribute('data-filter'))));

fetch('product.json')
    .then(response => response.json())
    .then(data => {
        productlist.innerHTML = data.map(product => `
            <li class="product" data-filter="${product.filter}">
                <img src="${product.image}" alt="">
                <div class="description">
                    <span>${product.description}</span>
                    <h4>${product.name}</h4>
                    <h3>${product.price} KM</h3>
                </div>
                <a><i class="fa-regular fa-heart heart"></i></a>
                <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
            </li>
        `).join('');
        filterProducts('All');
    })
    .catch(error => console.error('Error fetching and parsing JSON:', error));




