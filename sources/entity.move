module splitwise::entity {
  use std::vector;
  use std::string::{Self, String};
  use sui::event;

  use sui::object::{Self, UID};
  use sui::tx_context::TxContext;

  use splitwise::invoice::{Invoice, get_invoice_address};

  // Entity represents a company that is participating in the system
  struct Entity has key, store {
    id: UID,
    name: String,
    description: String,
    domicile: String,
    invoices: vector<address>
  }

  /* Events */
  struct EntityCreated has copy, drop {
    name: String
  }

  // Create an entity
  // This will create a entity
  public fun create_entity(
    name_bytes: vector<u8>, 
    description_bytes: vector<u8>, 
    domicile_bytes: vector<u8>, 
    ctx: &mut TxContext
  ) : Entity {
    let entity = Entity {
      id: object::new(ctx),
      name: string::utf8(name_bytes),
      description: string::utf8(description_bytes),
      domicile: string::utf8(domicile_bytes),
      invoices: vector::empty<address>()
    };

    event::emit(EntityCreated{ name: entity.name });

    entity
  }


  // Add an invoice to a entities invoices list
  public fun add_invoice_to_list(entity: &mut Entity, invoice: &Invoice, _ctx: &mut TxContext) {
    let add = get_invoice_address(invoice);
    // entity.invoices.push_back<address>(&mut entity.invoices, 10);
    vector::push_back<address>(&mut entity.invoices, add);
  }  

  // Get the name of an entity
  #[allow(unused_use)]
  public fun get_entity_name(entity: &Entity): &String {
    &entity.name
  }

  // Get the description of an entity
  #[allow(unused_use)]
  public fun get_entity_description(entity: &Entity): &String {
    &entity.description
  }

  // Get the domicile of an entity
  #[allow(unused_use)]
  public fun get_entity_domicile(entity: &Entity): &String {
    &entity.domicile
  }

  // Get the invoices of an entity
  #[allow(unused_use)]
  public fun get_entity_invoices(entity: &Entity): &vector<address> {
    &entity.invoices
  }
}
