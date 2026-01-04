const menuDiv = document.getElementById('menu');
const cartUl = document.getElementById('cart');
const checkoutBtn = document.getElementById('checkout');
let cart = [];

fetch('/api/menu')
  .then(res => res.json())
  .then(menu => {
    menu.forEach(cat => {
      const h3 = document.createElement('h3');
      h3.innerText = cat.category;
      menuDiv.appendChild(h3);
      cat.items.forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = item;
        btn.onclick = () => {
          cart.push(item);
          renderCart();
        };
        menuDiv.appendChild(btn);
      });
    });
  });

function renderCart() {
  cartUl.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item;
    cartUl.appendChild(li);
  });
}

checkoutBtn.onclick = () => {
  fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cart)
  }).then(res => res.json())
    .then(data => alert('Заказ сохранён!'));
};
