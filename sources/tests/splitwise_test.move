#[test_only]
module splitwise::test_splitwise {
  use splitwise::splitwise::{Self, Splitwise};
  use sui::test_scenario;
  // use sui::test_utils;
  // use sui::tx_context;

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