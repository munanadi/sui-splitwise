module splitwise::test_entity {
  // use splitwise::entity::{Self};
  // use sui::test_scenario;

  use splitwise::splitwise::AdminCapability;

  #[test]
  fun test_create_entity() {
    let owner = @0x1;

    let scenario_val = test_scenario::begin(owner);
    let scenario = &mut scenario_val;

    test_scenario::next_tx(scenario, owner);
    { 
      let admin_cap = test_scenario::teke_from_sender(scenario);
      // Create an Entity
      let entity = splitwise::entity::create_entity(
        &admin_cap,
        vector::empty<u8>(), // Name
        vector::empty<u8>(), // Description
        vector::empty<u8>(), // Domicile
        test_scenario::ctx(scenario)
      );
      
      // Check if the Entity was created with the correct initial values
      assert!(&entity.name == "", 0); 
      assert!(entity.description == "", 0); 
      assert!(entity.domicile == "", 0); 
      assert!(vector::length(&entity.invoices) == 0, 0); 
    };

    test_scenario::end(scenario_val);
  }
}
