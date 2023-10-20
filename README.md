# Splitwise Smart Contract

The Splitwise smart contract is designed for the SUI blockchain and allows users to manage entities, invoices, and transactions within the Splitwise platform. Try it out [here](https://sui-splitwise.vercel.app/)

## Table of Contents

- [Structures](#structures)
  - [Splitwise](#splitwise)
  - [AdminCapability](#admincapability)
  - [Entity](#entity)
  - [Invoice](#invoice)
- [Initialization](#initialization)
- [Functions](#functions)
- [Test Cases](#test-cases)
- [React App](#react-app)
- [Local Dev](#local-dev)

## Structures

### Splitwise

The `Splitwise` structure represents the main contract overseeing all entities. It keeps track of entity addresses.

### AdminCapability

The `AdminCapability` structure provides admin rights to certain users. It is used to grant admin privileges to an address during initialization.

### Entity

The `Entity` structure represents a participating company in the system. It has the following fields:

- `id`: A unique identifier for the entity.
- `name`: The name of the entity.
- `description`: A description of the entity.
- `domicile`: The domicile (location) of the entity.
- `invoices`: A vector containing addresses of invoices related to the entity.

### Invoice

The `Invoice` structure represents an invoice raised in the system. It has the following fields:

- `id`: A unique identifier for the invoice.
- `title`: The title of the invoice.
- `invoice_id`: The invoice ID.
- `payer`: The entity responsible for paying the invoice.
- `payee`: The entity to receive payment.
- `date`: The date when the invoice was created.
- `payment_due`: The deadline for payment.
- `entry_date`: The time invoice was entered into the system

## Initialization

The `init` function is called when the package is published. It initializes the Splitwise contract and grants admin capabilities to the address publishing the module.

## Functions

- `number_of_entities`: Returns the number of entities registered in the Splitwise module.

- `create_entity`: Creates a new entity with the specified name, description, and domicile.

- `create_invoice`: Creates a new invoice with the specified details.

- `add_invoice_to_list`: Adds an invoice to an entity's list of invoices.

## Test Cases

Test cases are provided to ensure the functionality of the smart contract.

- `test_create_splitwise`: Tests the creation of the Splitwise contract and checks if the initial entity count is zero.

## React App

`app` dir contains the whole frontend of the app.


## Local dev

> Make sure to have sui binaries installed.  
Check with `sui --verison`

To start the sui node
```bash
RUST_LOG="consensus=off" sui-test-validator
```

To publish the package
```bash
sui client publish --gas-budget 200000000 .
```

