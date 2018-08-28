var Customer = {
  getById: (client, customerId, callback) => {
    const customerQuery = `SELECT
        customers.first_name AS first_name,
        customers.middle_name AS middle_name,
        customers.last_name AS last_name,
        customers.email AS email,
        customers.state AS state,
        customers.city AS city,
        customers.street AS street,
        customers.zipcode AS zipcode,
        products.name AS product_name,
        orders.quantity AS quantity,
        orders.purchase_date AS purchase_date
      FROM orders
      INNER JOIN customers ON orders.customer_id = customers.id
      INNER JOIN products ON orders.product_id = products.id
      WHERE customers.id = ${customerId}
      ORDER BY purchase_date DESC
    `;
    client.query(customerQuery, (req,data) => {
      console.log(data.rows);
      var customerData = {
        first_name: data.rows[0].first_name,
        middle_name: data.rows[0].middle_name,
        last_name: data.rows[0].last_name,
        email: data.rows[0].email,
        state: data.rows[0].state,
        city: data.rows[0].city,
        street: data.rows[0].street,
        zipcode: data.rows[0].zipcode,
        product_name: data.rows[0].product_name,
        quantity: data.rows[0].quantity,
        purchase_date: data.rows[0].purchase_date
      };
      callback(customerData);
    });
  },

  list: (client, filter, callback) => {
    const customerListQuery = `
      SELECT * FROM customers
      ORDER BY id DESC
    `;
    client.query(customerListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Customer;
