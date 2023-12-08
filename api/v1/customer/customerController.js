import customerModel from "./customerModel.js";

async function getCustomer(req, res) {
  const user_email = req.user_email;
  try {
    const user = await customerModel.getCustomerFromEmail(user_email);
    if (user == null) {
      return res.status(403).send({ message: "Brugeren er ikke genkendt" });
    }
    if (user?.customer == null) {
      return res.status(403).send({ message: "Brugeren er ikke genkendt" });
    }
    const customer = user.customer;
    delete customer.customer_id;
    delete customer.registration_date;
    delete customer.user_id;
    res.json(customer);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export default { getCustomer };
