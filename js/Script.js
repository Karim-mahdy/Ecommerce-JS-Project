//------------Slider-----------------
document.addEventListener("DOMContentLoaded", function () {
  let sliderIndex = 0;
  const slider = document.querySelector('.slider');
  const sliderBtn1 = document.querySelector('.sliderBtn1');
  const sliderBtn2 = document.querySelector('.sliderBtn2');
  let interval;

  function updateSlider() {
    slider.style.transform = `translateX(-${sliderIndex * 25}%)`;
  }

  function startSliderInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      sliderIndex = (sliderIndex + 1) % 3;
      updateSlider();
    }, 3500);
  }

  sliderBtn1.addEventListener('click', function () {
    sliderIndex = (sliderIndex - 1 + 3) % 3;
    updateSlider();
    startSliderInterval(); // Restart the interval
  });

  sliderBtn2.addEventListener('click', function () {
    sliderIndex = (sliderIndex + 1) % 3;
    updateSlider();
    startSliderInterval(); // Restart the interval
  });

  startSliderInterval(); // Start the initial interval
});


//------------ slider Buttons -----------------

//------------Create Category Buttons -----------------

document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayProducts(); // Fetch and display all products initially
  createCategoryButtons();


  const backToTopBtn = document.getElementById("backToTopBtn");
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (localStorage.getItem('cartCount')) {
    cartCount = parseInt(localStorage.getItem('cartCount'));
    updateCartCounter();
  }



});


var products;
function createCategoryButtons() {
  fetch("https://dummyjson.com/products")
    .then(response => response.json())
    .then(data => {

      products = data.products;
      var category = products.map(element => element.category);
      var uniqueArray = [...new Set(category)];

      // var category = [];
      // products.forEach(element => {
      //   category.push(element.category);
      // });

      // let uniqueArray = category.filter((value, index, self) => {
      //   return self.indexOf(value) === index;
      // });
      var btsDiv = document.getElementById('buttons');
      for (let i = 0; i < uniqueArray.length; i++) {
        var btn = document.createElement('a');
        btn.textContent = uniqueArray[i];
        btn.classList.add('custom-button');

        //----All products btn ----
        if (i === 0) {
          var btn2 = document.createElement('a');
          btn2.textContent = "All Products";
          btn2.classList.add('custom-button');
          btsDiv.appendChild(btn2);
          btn2.addEventListener('click', function () {
            fetchAndDisplayProducts();
          })
        }

        btsDiv.appendChild(btn);
        btn.addEventListener('click', function () {
          fetchAndDisplayProducts(uniqueArray[i]);
        });

      }
    })
    .catch(error => {
      console.error("Error fetching JSON data:", error);
    });
}

//--------------- view products -----------------------

function fetchAndDisplayProducts(selectedCategory = null, selectedProduct) {
  fetch("https://dummyjson.com/products")
    .then(response => response.json())
    .then(data => {
      let products = data.products;

      let row1 = document.querySelector('.rowDiv');
      row1.innerHTML = "";

      //------------Search for products --------------------
      if (selectedProduct != null) {           
          products={};
          products= selectedProduct.products;
      }
      console.log(products);
      products.forEach(item => {
        if (!selectedCategory || item.category === selectedCategory) {   
          const col = document.createElement("div");
          col.classList.add("div-selected");

          const thumbnail = document.createElement("div");
          thumbnail.classList.add("thumbnail-div");
          const div = document.createElement("div");
          const image = document.createElement("img");
          image.classList.add("product-img");
          div.classList.add("img-div");
          image.src = item.thumbnail;
          image.alt = item.name;

          const caption = document.createElement("div");
          caption.classList.add("product-caption");

          caption.innerHTML = `
            <h4>${item.title}</h4>
            <h6>${item.description}</h6>
            <h6><a class="label label-success">Price: ${item.price} $</a></h6>
            <button class="btn btn-primary btn-block" onclick="addToCart(${item.id})">ADD TO CART</button>
          `;

          thumbnail.appendChild(div);
          div.appendChild(image);
          thumbnail.appendChild(caption);
          col.appendChild(thumbnail);
          row1.appendChild(col);
        }
      });
    })
    .catch(error => {
      console.error("Error fetching JSON data:", error);
    });
}

//----------------view cart--------------

//----------------add to cart--------------
let cartItems = [];
let cartCount = 0;

function addToCart(productId) {

  fetch(`https://dummyjson.com/products/${productId}`)
    .then(response => response.json())
    .then(data => {
      cartItems.push(data)
      //viewCart();
      addTolocalStorage(data);

      updateCartCounter();

    })
    .catch(error => {
      console.error("Error fetching JSON data:", error);
    });
}

function addTolocalStorage(product) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems.push(product);
  cartCount++;

  localStorage.setItem('cartCount', cartCount.toString());
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}



function updateCartCounter() {
  var cartCounter = document.querySelector('.cart-counter');
  cartCounter.textContent = cartCount;
}


//-----------search for products--------------------------------
function searchProduct() {
  const searchBox = document.getElementById('search-box');
  const searchResults = document.getElementById('search-results');
  const searchTerm = searchBox.value.trim();


  fetch(`https://dummyjson.com/products/search?q=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      var selectedProduct = data;
      if (data.length === 0) {
        searchResults.innerHTML = 'No products found.';

      } else {
        fetchAndDisplayProducts(null, selectedProduct);
      }
    })
    .catch(error => {
      // searchResults.innerHTML = 'An error occurred while fetching data.';
      console.error(error);
    });
}