module splitwise::test_entity {
  use sui::test_scenario;
  use std::string;
  use std::vector;
  use sui::transfer;
  use sui::tx_context;

  use splitwise::splitwise::AdminCapability;
  use splitwise::entity::{
    get_entity_name, 
    get_entity_description, 
    get_entity_domicile, 
    get_entity_invoices
  };

  #[test]
  fun test_create_entity() {
    let owner = @0x1;

    let scenario_val = test_scenario::begin(owner);
    let scenario = &mut scenario_val;

    test_scenario::next_tx(scenario, owner);
    { 
      let admin_cap = test_scenario::take_from_sender<AdminCapability>(scenario);
      let ctx = test_scenario::ctx(scenario);
      // Create an Entity
      let entity = splitwise::entity::create_entity(
        &admin_cap,
        vector::empty<u8>(), // Name
        vector::empty<u8>(), // Description
        vector::empty<u8>(), // Domicile
        ctx
      );
      
      // Check if the Entity was created with the correct initial values
      assert!(string::is_empty(get_entity_name(&entity)), 0); 
      assert!(string::is_empty(get_entity_description(&entity)), 0); 
      assert!(string::is_empty(get_entity_domicile(&entity)), 0); 
      assert!(vector::length<address>(get_entity_invoices(&entity)) == 0, 0); 

      transfer::public_transfer(entity, tx_context::sender(ctx));
      test_scenario::return_to_sender(scenario, admin_cap)
    };

    test_scenario::end(scenario_val);
  }
}
