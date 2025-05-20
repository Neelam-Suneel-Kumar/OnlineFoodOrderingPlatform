// Default Owner Phone Number
const ownerPhoneNumber = "8179675459";
const customerPhoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phone-error');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const quantities = document.querySelectorAll('.quantity');
const totalPriceElement = document.getElementById('total-price');

// Set the owner's phone number as default
customerPhoneInput.value = ownerPhoneNumber;
customerPhoneInput.setAttribute('readonly', true);

// Items and Prices
const items = [
    { name: "Burger", price: 150 },
    { name: "Cone Ice Cream", price: 35 },
    // Add other items here
];

// Calculate Total Price
function calculateTotal() {
    let total = 0;
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const quantityInput = quantities[index];
            const quantity = parseInt(quantityInput.value) || 0;
            const item = items.find(i => i.name === checkbox.value);
            total += item.price * quantity;
        }
    });
    totalPriceElement.textContent = total;
}

// Update total on quantity or checkbox change
quantities.forEach(quantity => {
    quantity.addEventListener('input', calculateTotal);
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotal);
});

// Submit Order to WhatsApp
document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (customerPhoneInput.value !== ownerPhoneNumber) {
        alert('You cannot change the phone number.');
        return;
    }

    // Gather order details for owner and customer
    let messageOwner = "🧾 *New Order from Cream More*%0A";
    let messageCustomer = "🧾 *Your Order Details* from Cream More%0A";
    let total = 0;
    let hasItems = false;

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const quantityInput = quantities[index];
            const quantity = parseInt(quantityInput.value) || 0;
            if (quantity > 0) {
                const item = items.find(i => i.name === checkbox.value);
                const price = item.price * quantity;
                messageOwner += `• ${item.name} x ${quantity} = ₹${price}%0A`;
                messageCustomer += `• ${item.name} x ${quantity} = ₹${price}%0A`;
                total += price;
                hasItems = true;
            }
        }
    });

    if (!hasItems) {
        alert("Please select at least one item.");
        return;
    }

    messageOwner += `%0A💰 *Total: ₹${total}*`;
    messageCustomer += `%0A💰 *Total: ₹${total}*`;

    const whatsappURLOwner = `https://wa.me/${ownerPhoneNumber}?text=${messageOwner}`;
    const whatsappURLCustomer = `https://wa.me/${customerPhoneInput.value}?text=${messageCustomer}`;

    const confirmOrder = confirm("Do you want to place this order?");
    if (confirmOrder) {
        window.open(whatsappURLOwner, '_blank');
        window.open(whatsappURLCustomer, '_blank');
    }
});
