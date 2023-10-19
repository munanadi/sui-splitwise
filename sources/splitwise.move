module splitwise::splitwise { 
  use std::vector;
  use std::string::{Self, String};

  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};
  use sui::transfer;
  use sui::balance::{Self, Balance};
  use sui::coin::{Self, Coin};
  use sui::pay;

  /// @description Splitwise is the contract that oversees all this
  /// Have a masterlist of all entities
  /// All the registered entites would be stored with us
  struct Splitwise has key, store {
    id: UID,
    entity_addresses: vector<address>
  }

  /// Admin rights
  struct AdminCapability has key {
    id: UID
  }

  /// Entity represents a company that is participating in the system
  struct Entity has key, store {
    id: UID,
    name: String,
    description: String,
    domicile: String,
    invoices: vector<address>
  }

  /// Invoice represents the invoice that is raised in the system
  struct Invoice has key, store {
    id: UID,
    title: String,
    invoice_id: String,
    payer: String,
    payee: String,
    date: u64,
    paymentDue: u64
  }

  /// Init function called when the package is published
  /// Give AdminCap to the address publishing the module
  fun init (ctx: &mut TxContext) {
    // Create the Spitwise Object and transfer
    transfer::transfer(Splitwise {
      id: object::new(ctx),
      entity_addresses: vector::empty<address>()
    }, tx_context::sender(ctx));

    // Create the Admin Cap and trasnfer
    transfer::transfer(AdminCapability {
      id: object::new(ctx)
    }, tx_context::sender(ctx))
  }

  /// Look at the number of entites registerd in splitwise module
  public fun number_of_entities(splitwise: &Splitwise, ctx: &mut TxContext): u64 {
    vector::length<address>(&splitwise.entity_addresses)
  }

  /// Create an entity
  /// This will create a entity
  public fun create_entity(
    _: &AdminCapability, 
    name_bytes: vector<u8>, 
    description_bytes: vector<u8>, 
    domicile_bytes: vector<u8>, 
    ctx: &mut TxContext
  ) : Entity {
    Entity {
      id: object::new(ctx),
      name: string::utf8(name_bytes),
      description: string::utf8(description_bytes),
      domicile: string::utf8(domicile_bytes),
      invoices: vector::empty<address>()
    }
  }

  /// Create an Invoice
  public fun create_invoice(
    _: &AdminCapability,
    title_bytes: vector<u8>,
    invoice_id_bytes: vector<u8>,
    payer_bytes: vector<u8>,
    payee_bytes: vector<u8>,
    date: u64,
    paymentDue: u64,
    ctx: &mut TxContext 
  ) : Invoice {
    Invoice {
      id: object::new(ctx),
      title: string::utf8(title_bytes),
      invoice_id: string::utf8(invoice_id_bytes),
      payer: string::utf8(payer_bytes),
      payee: string::utf8(payee_bytes),
      date,
      paymentDue
    }
  }

  /// Add an invoice to a entities invoices list
  public fun add_invoice_to_list(entity: &mut Entity, invoice: &Invoice, ctx: &mut TxContext) {
    let add = object::uid_to_address(&invoice.id);
    // entity.invoices.push_back<address>(&mut entity.invoices, 10);
    vector::push_back<address>(&mut entity.invoices, add);
  }  

  #[test_only]
  public fun init_for_testing(ctx: &mut TxContext){
    init(ctx);
  }
}

#[test_only]
module splitwise::test_splitwise {
  use splitwise::splitwise::{Self, Splitwise};
  use sui::test_scenario;
  use sui::test_utils;
  use sui::tx_context;

  #[test]
  fun test_create_splitwise() {
    let owner = @0x1;

    let scenario_val = test_scenario::begin(owner);
    let scenario = &mut scenario_val;

    test_scenario::next_tx(scenario, owner);
    { 
      splitwise::init_for_testing(test_scenario::ctx(scenario));
    };

    test_scenario::next_tx(scenario, owner);
    {
      let splitwise_val = test_scenario::take_shared<Splitwise>(scenario);
      let splitwise = &mut splitwise_val;
      let ctx = test_scenario::ctx(scenario);

      let entities_count = splitwise::number_of_entities(splitwise, ctx);
      // Initiall the vector should be empty
      assert!(entities_count == 0, 0); 

      test_scenario::return_shared(splitwise_val);
    };

    test_scenario::end(scenario_val);
  }

  // #[test]
  // fun test_create_entity() {
  //   let owner = @0x1;

  //   let scenario_val = test_scenario::begin(owner);
  //   let scenario = &mut scenario_val;

  //   test_scenario::next_tx(scenario, owner);
  //   {
  //     splitwise::create_entity(test_scenario::ctx(scenario));
  //   };

  //   test_scenario::end(scenario_val);
  // }
}