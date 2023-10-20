module splitwise::splitwise { 
  use std::vector;

  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};
  use sui::transfer;
  // use sui::balance::{Self, Balance};
  // use sui::coin::{Self, Coin};
  // use sui::pay;

  /// @description Splitwise is the contract that oversees all this
  /// Have a masterlist of all entities
  /// All the registered entites would be stored with us
  struct Group has key, store {
    id: UID,
    entity_addresses: vector<address>
  }

  struct Splitwise has key, store {
    id: UID
  }

  /// Admin rights
  struct AdminCapability has key {
    id: UID
  }

  /// Init function called when the package is published
  /// Give AdminCap to the address publishing the module
  fun init (ctx: &mut TxContext) {
    // Create the Splitwise object
    let splitwise = Splitwise {
      id: object::new(ctx)
    };
    transfer::transfer(splitwise, tx_context::sender(ctx));

    // Create the Group Object
    let group = Group {
      id: object::new(ctx),
      entity_addresses: vector::empty<address>()
    };
    // Add the creator into the entity list as well
    vector::push_back<address>(&mut group.entity_addresses, tx_context::sender(ctx));

    // Need this object to be shared by everyone since any one can join this group
    transfer::share_object(group);

    // Create the Admin Cap and trasnfer
    transfer::transfer(AdminCapability {
      id: object::new(ctx)
    }, tx_context::sender(ctx));
  }

  /// Add new entities into the splitwise entity array
  public fun add_new_entites(group: &mut Group, entity_address: address) {
    vector::push_back<address>(&mut group.entity_addresses, entity_address);
  }

  /// Look at the number of entites registerd in splitwise module
  public fun number_of_entities(group: &Group, _ctx: &mut TxContext): u64 {
    vector::length<address>(&group.entity_addresses)
  }

  // Expose the group id to public
  public fun group_id(group: &Group, ctx: &mut TxContext): address {
    object::uid_to_address(&group.id)
  }

  #[test_only]
  public fun init_for_testing(ctx: &mut TxContext){
    init(ctx);
  }
}
