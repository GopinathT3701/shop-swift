const customerPaid = (orderId, total, orderItems, address) => {
  return `
  <h2>🎉 Payment Successful</h2>

  <p><b>Order ID:</b> #${orderId}</p>
  <p><b>Status:</b> Paid</p>
  <p><b>Total Amount:</b> ₹${total}</p>

  <h3>🛍 Ordered Items</h3>

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
    ${address?.name || ""}<br/>
    ${address?.address1 || ""}<br/>
    ${address?.city || ""}, ${address?.state || ""} - ${address?.zipcode || ""}
  </p>
  `;
};

export default customerPaid;