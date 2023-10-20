module splitwise::invoice {
  // use std::vector;
  use std::string::{Self, String};
  use sui::event;

  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};

  use splitwise::splitwise::AdminCapability;
  // use splitwise::entity;

  // Invoice represents the invoice that is raised in the system
  struct Invoice has key, store {
    id: UID,
    title: String,
    invoice_id: String,
    payer: String,
    payee: String,
    date: u64,
    payment_due: u64,
    entry_date: u64,
  }

  /* Events */
  struct InvoiceCreated has copy, drop {
    invoice_id: String
  }

  // Create an Invoice
  public fun create_invoice(
    _: &AdminCapability,
    title_bytes: vector<u8>,
    invoice_id_bytes: vector<u8>,
    payer_bytes: vector<u8>,
    payee_bytes: vector<u8>,
    date: u64,
    payment_due: u64,
    ctx: &mut TxContext 
  ) : Invoice {
    let invoice = Invoice {
      id: object::new(ctx),
      title: string::utf8(title_bytes),
      invoice_id: string::utf8(invoice_id_bytes),
      payer: string::utf8(payer_bytes),
      payee: string::utf8(payee_bytes),
      date,
      payment_due,
      entry_date: tx_context::epoch_timestamp_ms(ctx)
    };

    event::emit(InvoiceCreated{ invoice_id: invoice.invoice_id });

    invoice
  }

  // Get the title of an entity
  #[allow(unused_use)]
  public fun get_invoice_title(invoice: &Invoice): &String {
    &invoice.title
  }

  // Get the invoice_id of an entity
  #[allow(unused_use)]
  public fun get_invoice_invoice_id(invoice: &Invoice): &String {
    &invoice.invoice_id
  }

  // Get the payer of an entity
  #[allow(unused_use)]
  public fun get_invoice_payer(invoice: &Invoice): &String {
    &invoice.payer
  }
  
  // Get the payee of an entity
  #[allow(unused_use)]
  public fun get_invoice_payee(invoice: &Invoice): &String {
    &invoice.payee
  }

  // Get address of the invoice's id
  #[allow(unused_use)]
  public fun get_invoice_address(invoice: &Invoice): address {
    object::id_address(invoice)
  }
}
