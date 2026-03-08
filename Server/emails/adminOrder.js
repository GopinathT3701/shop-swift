const adminOrder = (orderId, total, orderItems, address, payment_method) => {
  return `
  <h2>🆕 New Order Received</h2>

  <p><b>Order ID:</b> #${orderId}</p>
  <p><b>Customer:</b> ${address?.name}</p>
  <p><b>Payment:</b> ${payment_method}</p>
  <p><b>Total:</b> ₹${total}</p>

  <h3>🛍 Order Items</h3>

  <table border="1" cellpadding="8" cellspacing="0">
    <tr>
      <th>Product</th>
      <th>Qty</th>
      <th>Price</th>
    </tr>

    ${orderItems.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `).join("")}
  </table>

  <h3>📦 Shipping Address</h3>

  <p>
    ${address?.name}<br/>
    ${address?.address1}<br/>
    ${address?.city}, ${address?.state} - ${address?.zipcode}
  </p>
  `;
};

export default adminOrder;