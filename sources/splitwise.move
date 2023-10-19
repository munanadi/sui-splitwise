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

  #[test_only]
  public fun init_for_testing(ctx: &mut TxContext){
    init(ctx);
  }
}
