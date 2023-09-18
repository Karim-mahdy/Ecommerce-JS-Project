document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
    if (localStorage.getItem('cartCount')) {
        cartCount = parseInt(localStorage.getItem('cartCount'));
        updateCartCounter();
    }
   
});


// Function to calculate the Quality (total quantity) for each item in the cart
function calculateQuality(cartItems) {
    const qualityMap = {}; // Use a map to track quantities by item ID

    cartItems.forEach(item => {
        const itemId = item.id;
        if (qualityMap[itemId]) {
            qualityMap[itemId] += 1; // Increment quantity if item exists
        } else {
            qualityMap[itemId] = 1; // Initialize quantity if item doesn't exist
        }
    });

    return qualityMap;
}

function displayCartItems() {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = "";

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const qualityMap = calculateQuality(cartItems); // Calculate Quality

    // Create a Set to keep track of processed item IDs
    const processedItems = new Set();

    cartItems.forEach(item => {
        const itemId = item.id;

        // Only process each item once
        if (!processedItems.has(itemId)) {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");
            cartItemDiv.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}">
                <div class="content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <p>Price: ${item.price} $</p>
                    <p>Quantity: ${qualityMap[itemId]}</p> <!-- Display Quality -->
                    <p class="total-price">Total Price: ${item.price * qualityMap[itemId]} $</p> <!-- Calculate Total Price -->
                    <button class="remove-btn" onclick="removeCartItem(${item.id})">Remove</button>
                </div>
            `;
            cartItemsDiv.appendChild(cartItemDiv);

            // Add the item to the processed set
            processedItems.add(itemId);
        }
    });
}

function removeCartItem(itemId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === itemId) {
            if (cartItems[i].count > 1) {
                cartItems[i].count--; // Decrement the count
            } else {
                cartItems.splice(i, 1); // Remove the item if count is 1
            }
            break;
        }
    }

    // Update cart count
    cartCount--;
    localStorage.setItem('cartCount', cartCount.toString());
    updateCartCounter();
    
    // Update local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    displayCartItems();
}


function updateCartCounter() {
    
    var cartCounter = document.querySelector('.cart-counter');
    cartCounter.textContent = cartCount;
    // console.log(cartCounter);
  }