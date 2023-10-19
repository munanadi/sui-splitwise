module splitwise::entity {
  use std::vector;
  use std::string::{Self, String};

  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};

  use splitwise::splitwise::AdminCapability;

  /// Entity represents a company that is participating in the system
  struct Entity has key, store {
    id: UID,
    name: String,
    description: String,
    domicile: String,
    invoices: vector<address>
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
}
