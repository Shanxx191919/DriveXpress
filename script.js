// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Simple cart functionality
    let cart = [];

    const addToCart = (car) => {
        cart.push(car);
        alert(`${car} has been added to your cart!`);
        console.log(cart);
    };

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const carCards = document.querySelectorAll('.car-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-red-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-800');
            });

            // Add active class to clicked button
            button.classList.remove('bg-gray-200', 'text-gray-800');
            button.classList.add('bg-red-500', 'text-white');

            // Filter cars
            const category = button.getAttribute('data-category');
            carCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Color selection functionality for each car
    const carCardsArray = Array.from(carCards);
    carCardsArray.forEach(card => {
        const carImage = card.querySelector('.car-image');
        const colorSwatches = card.querySelector('.color-swatches');
        const selectedColor = card.querySelector('.selected-color');

        colorSwatches.addEventListener('click', (e) => {
            if (e.target.classList.contains('cursor-pointer')) {
                const color = e.target.getAttribute('data-color');
                const imageUrl = e.target.getAttribute('data-image');

                // Update selected color text
                selectedColor.textContent = color;

                // Add fade-out animation and change image
                carImage.classList.remove('fade');
                void carImage.offsetWidth; // Trigger reflow
                carImage.src = imageUrl;
                carImage.classList.add('fade');
            }
        });
    });

    // Example usage (to be expanded with buttons)
    window.addToCart = addToCart;
});