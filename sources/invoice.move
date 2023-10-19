module splitwise::invoice {
  use std::vector;
  use std::string::{Self, String};

  use sui::object::{Self, UID};
  use sui::tx_context::{Self, TxContext};

  use splitwise::splitwise::AdminCapability;

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

}
