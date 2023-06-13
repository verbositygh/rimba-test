<script setup>
import {faker} from '@faker-js/faker';
import CustomerValidation from '../lib/validators/CustomerValidation';
import vueImage from '../lib/dummies/images/vue';
import ItemValidation from '~/lib/validators/ItemValidation';
import TransactionValidation from '~/lib/validators/TransactionValidation';

const { data: customers, refresh: refetchCustomers } = useFetch('/api/customers');
const { data: items, refresh: refetchItems } = useFetch('/api/items');
const { data: sales, refresh: refetchSales } = useFetch('/api/sales');

function getItemStock(i) {
  return  i.quantity - i.transactions.reduce((acc, curr) => acc + curr.quantity, 0);
}

function getSum(i) {
  return i.reduce((acc, curr) => acc + curr, 0);
}

const Customer = ref({
  Name: '',
  Email: '',
  Phone: '',
  Address: '',
  Discount: '',
  DiscountType: '',
  Image: '',
});
const Item = ref({
  Name: '',
  Quantity: '',
  Unit: '',
  Price: '',
  Image: '',
});
const Sale = ref({
  Code: '',
  CustomerId: '',
  Quantities: '',
  ItemIds: '',
});

const basePostFetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};
const baseDeleteFetchOptions = {
  method: 'DELETE',
};

// FILL
function handleFillCustomerForm() {
  Customer.value.Name = faker.person.fullName();
  Customer.value.Email = faker.internet.email();
  Customer.value.Phone = faker.phone.number('+##########');
  Customer.value.Address = faker.location.streetAddress();
  Customer.value.DiscountType = faker.helpers.arrayElement(['fixed', 'percentage']);
  if (Customer.value.DiscountType === 'percentage') {
    Customer.value.Discount = faker.number.int({min: 1, max: 100});
  } else {
    Customer.value.Discount = faker.number.int({min: 1, max: 1000});
  }
  Customer.value.Image = vueImage;
}

function handleFillItemForm() {
  Item.value.Name = faker.commerce.productName();
  Item.value.Unit = faker.helpers.arrayElement(['kg', 'pcs']);
  Item.value.Quantity = faker.number.int({min: 1, max: 1000});
  Item.value.Price = faker.number.int({min: 1, max: 1000});
  Item.value.Image = faker.image.dataUri();
}

function handleFillSaleForm() {
  Sale.value.Code = `${faker.string.alpha({casing: 'upper', length: 1})}${faker.string.numeric({allowLeadingZeros: true, length: 3})}`;
  Sale.value.Quantities = `${faker.number.int({min: 1, max:getItemStock(items.value[0])})}`;
  Sale.value.ItemIds = '1';
  Sale.value.CustomerId = faker.helpers.arrayElement(customers.value.map(c => c.id));
}

// SUBMISSION
async function handleCustomerFormSubmission() {
  const payload = {
    name: Customer.value.Name,
    email: Customer.value.Email,
    phone: Customer.value.Phone,
    address: Customer.value.Address,
    discount: Customer.value.Discount,
    discountType: Customer.value.DiscountType,
    idCardImage: Customer.value.Image,
  }
  CustomerValidation.parse(payload);
  await fetch('/api/customers', {...basePostFetchOptions, body: JSON.stringify(payload)});
  refetchCustomers();
}
async function handleItemFormSubmission() {
  const payload = {
    name: Item.value.Name,
    unit: Item.value.Unit,
    quantity: Item.value.Quantity,
    price: Item.value.Price,
    itemImage: Item.value.Image,
  };
  ItemValidation.parse(payload);
  await fetch('/api/items', {...basePostFetchOptions, body: JSON.stringify(payload)});
  refetchItems();
}
async function handleSaleFormSubmission() {
  const quantities = Sale.value.Quantities.split(' ');
  const itemIds = Sale.value.ItemIds.split(' ');
  if (quantities.length != itemIds.length || quantities.length > new Set(quantities).size || itemIds.length > new Set(itemIds).size) {
    throw new Error('Inconsistent items');
  }
  const payload = {
    code: Sale.value.Code,
    time: new Date().toISOString(),
    customerId: parseInt(Sale.value.CustomerId),
    items: [],
  };
  for (let i = 0; i < quantities.length; ++i){
    payload.items.push({
      id: parseInt(itemIds[i]),
      quantity: parseFloat(quantities[i]),
    });
  }
  TransactionValidation.parse(payload);
  await fetch('/api/sales', {...basePostFetchOptions, body: JSON.stringify(payload)});
  refetchSales();
}

// DELETE
async function handleCustomerDeletion(id) {
  await fetch(`/api/customers/${id}`, baseDeleteFetchOptions);
  refetchCustomers();
  refetchItems();
  refetchSales();
}
async function handleItemDeletion(id) {
  await fetch(`/api/items/${id}`, baseDeleteFetchOptions);
  refetchItems();
  refetchSales();
}
async function handleSaleDeletion(id) {
  await fetch(`/api/sales/${id}`, baseDeleteFetchOptions);
  refetchCustomers();
  refetchItems();
  refetchSales();
}
</script>

<template>
  <div>
    <h1>Customers</h1>
    <form>
      <button @click.prevent="handleFillCustomerForm">Fill with Fake Data</button>
      <div>
        <label for="Customer.Name">Name</label>
        <input name="Customer.Name" id="Customer.Name" v-model="Customer.Name">
      </div>
      <div>
        <label for="Customer.Email">Email</label>
        <input name="Customer.Email" id="Customer.Email" v-model="Customer.Email">
      </div>
      <div>
        <label for="Customer.Phone">Phone</label>
        <input name="Customer.Phone" id="Customer.Phone" v-model="Customer.Phone">
      </div>
      <div>
        <label for="Customer.Address">Address</label>
        <input name="Customer.Address" id="Customer.Address" v-model="Customer.Address">
      </div>
      <div>
        <label for="Customer.Discount">Discount</label>
        <input type="number" name="Customer.Discount" id="Customer.Discount" v-model="Customer.Discount">
        <select v-model="Customer.DiscountType">
          <option>fixed</option>
          <option>percentage</option>
        </select>
      </div>
      <div>
        <label for="Customer.Image">ID Card Image (Base64)</label>
        <input name="Customer.Image" id="Customer.Image" v-model="Customer.Image">
      </div>
      <button @click.prevent="handleCustomerFormSubmission">Add</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>ID Card</th>
          <th>Discount</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody v-for="c in customers">
        <tr>
          <td>{{ c.id }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.email }}</td>
          <td>{{ c.phone }}</td>
          <td>{{ c.address }}</td>
          <td><img :src="c.idCardImage" alt="ID Card" style="height: 50px;"></td>
          <td>{{ c.discount }}{{ c.discountType === 'percentage' ? '%' : '' }}</td>
          <td v-if="c.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleCustomerDeletion(c.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h1>Items</h1>
    <form>
      <button @click.prevent="handleFillItemForm">Fill with Fake Data</button>
      <div>
        <label for="Item.Name">Name</label>
        <input name="Item.Name" id="Item.Name" v-model="Item.Name">
      </div>
      <div>
        <label for="Item.Quantity">Quantity</label>
        <input type="number" name="Item.Quantity" id="Item.Quantity" v-model="Item.Quantity">
        <select v-model="Item.Unit">
          <option>kg</option>
          <option>pcs</option>
        </select>
      </div>
      <div>
        <label for="Item.Price">Price</label>
        <input type="number" name="Item.Price" id="Item.Price" v-model="Item.Price">
      </div>
      <div>
        <label for="Item.Image">Item Image (Base64)</label>
        <input name="Item.Image" id="Item.Image" v-model="Item.Image">
      </div>
      <button @click.prevent="handleItemFormSubmission">Add</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Stock</th>
          <th>Price</th>
          <th>Image</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody v-for="i in items">
        <tr>
          <td>{{ i.id }}</td>
          <td>{{ i.name }}</td>
          <td>{{ getItemStock(i) }} {{ i.unit }}</td>
          <td>{{ i.price }}</td>
          <td><img :src="i.itemImage" alt="ID Card" style="height: 50px;"></td>
          <td v-if="i.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleItemDeletion(i.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h1>Sales</h1>
      <h2>Form</h2>
    <form>
      <button @click.prevent="handleFillSaleForm">Fill with Fake Data</button>
      <div>
        <label for="Sale.Code">Code</label>
        <input name="Sale.Code" id="Sale.Code" v-model="Sale.Code">
      </div>
      <div>
        <label for="Sale.Quantities">Quantities (space separated)</label>
        <input name="Sale.Quantities" id="Sale.Quantities" v-model="Sale.Quantities">
      </div>
      <div>
        <label for="Sale.ItemIds">Item IDs (space separated)</label>
        <input name="Sale.ItemIds" id="Sale.ItemIds" v-model="Sale.ItemIds">
      </div>
      <div>
        <label for="Sale.CustomerId">Customer ID</label>
        <input name="Sale.CustomerId" id="Sale.CustomerId" v-model="Sale.CustomerId">
      </div>
      <button @click.prevent="handleSaleFormSubmission">Add</button>
    </form>
    <h2>Table</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Code</th>
          <th>Customer</th>
          <th>Quantity</th>
          <th>Time</th>
          <th>Price</th>
          <th>Item Images</th>
          <th>Delete?</th>
        </tr>
      </thead>
      <tbody v-for="s in sales">
        <tr>
          <td>{{ s.id }}</td>
          <td>{{ s.code }}</td>
          <td>{{ s.customer.name }}</td>
          <td>{{ s.items.map(i => {
            return `${i.quantity}${i.item.unit} of ${i.item.name}`;
          }).join(', ') }}</td>
          <td>{{ s.time }}</td>
          <td>{{ getSum(s.items.map(i => i.item.price * i.quantity)) }} - {{ s.customer.discount }}{{
            s.customer.discountType === 'percentage' ? '% × ' + getSum(s.items.map(i => i.item.price * i.quantity)) : '' }}
            = {{ getSum(s.items.map(i => i.item.price * i.quantity)) - (s.customer.discountType === 'percentage' ?
              getSum(s.items.map(i => i.item.price * i.quantity)) / 100 * s.customer.discount : s.customer.discount) }}</td>
          <td v-for="i in s.items" style="max-width: 100px;">
            <img :src="i.item.itemImage" alt="ID Card" style="height: 50px;">
          </td>
          <td v-if="s.id == 1">
            Seeded Data
          </td>
          <td v-else>
            <button @click.prevent="handleSaleDeletion(s.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div></template>
