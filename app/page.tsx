
'use client';
import { useEffect, useMemo, useState } from 'react';
type LineItem = {
  description: string;
  quantity: number;
  price: number;
};

const money = (value: number) =>
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(value);

export default function Home() {
const [businessName, setBusinessName] = useState('');
const [customerName, setCustomerName] = useState('');
const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('1');
  const [validUntil, setValidUntil] = useState(() => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
});
  const [vatRate, setVatRate] = useState(5);
  const [notes, setNotes] = useState('Thank you for the opportunity. This quotation is valid until the date shown above.');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [appActive, setAppActive] = useState(true);
  const [savingQuote, setSavingQuote] = useState(false);
const [items, setItems] = useState<LineItem[]>([
  { description: '', quantity: 1, price: 0 },
]);
const [customers, setCustomers] = useState<any[]>([]);
const [selectedCustomerId, setSelectedCustomerId] = useState('');
useEffect(() => {
  loadCustomers();
  loadNextQuoteNumber();
  checkAppStatus();
}, []);
useEffect(() => {
  const savedBusinessName = localStorage.getItem('businessName');

  if (savedBusinessName) {
    setBusinessName(savedBusinessName);
  }
}, []);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );
  const vat = subtotal * (vatRate / 100);
  const total = subtotal + vat;

  const updateItem = (index: number, key: keyof LineItem, value: string) => {
    setItems((current) => current.map((item, i) => {
      if (i !== index) return item;
      return {
        ...item,
        [key]: key === 'description' ? value : Number(value || 0),
      } as LineItem;
    }));
  };

  const addItem = () => setItems((current) => [...current, { description: '', quantity: 1, price: 0 }]);
  const removeItem = (index: number) => setItems((current) => current.filter((_, i) => i !== index));
  const saveQuote = async () => {
    setSavingQuote(true);
  try {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerCompany,
        items,
        subtotal,
        vat,
        total,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Could not save quotation');
      return;
    }

    alert('Quotation saved successfully');
    setSelectedCustomerId('');
setCustomerName('');
setCustomerEmail('');
setCustomerPhone('');
setCustomerCompany('');
setItems([
  { description: '', quantity: 1, price: 0 }
]);
setNotes('');
loadNextQuoteNumber();
 } catch {
  alert('Something went wrong while saving');
} finally {
  setSavingQuote(false);
}
};
  const loadNextQuoteNumber = async () => {
  try {
    const response = await fetch('/api/quotes');
    const result = await response.json();

    if (result.success) {
  const numbers = result.quotations
  .map((quote: any) => {
    const value = String(quote.quote_number || '');

    return /^\d+$/.test(value) ? Number(value) : 0;
  });

const highest = Math.max(0, ...numbers);

setQuoteNumber(String(highest + 1));
    }

  } catch {
    console.error('Could not create next quote number');
  }
};
const loadCustomers = async () => {

  const chooseCustomer = (customerId: string) => {
  setSelectedCustomerId(customerId);

  const customer = customers.find(
    (item) => String(item.id) === customerId
  );

if (customer) {
  setCustomerName(customer.name || '');
  setCustomerEmail(customer.email || '');
  setCustomerPhone(customer.phone || '');
  setCustomerCompany(customer.company_name || '');
}
};
  try {
    const response = await fetch('/api/customers');
    const result = await response.json();

    if (result.success) {
      setCustomers(result.customers);
    }
  } catch {
    console.error('Could not load customers');
  }
};


const chooseCustomer = (customerId: string) => {
  setSelectedCustomerId(customerId);

  const customer = customers.find(
    (item) => String(item.id) === String(customerId)
  );

  if (customer) {
    setCustomerName(customer.name || '');
    setCustomerEmail(customer.email || '');
    setCustomerPhone(customer.phone || '');
    setCustomerCompany(customer.company_name || '');
  }
};
const checkAppStatus = async () => {
  try {
    const response = await fetch('/api/app-status');
    const result = await response.json();

    if (result.success) {
      setAppActive(result.active);
    }
  } catch {
    console.error('Could not check app status');
  }
};
const generateWithAI = async () => {
  setGeneratingAI(true);

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
     body: JSON.stringify({
  businessName,
  customerName,
  validUntil,
  items,
  subtotal,
  vat,
  total,
}),
    });

    const result = await response.json();

    if (result.success) {
      setNotes(result.text);
    } else {
      alert('AI generation failed');
    }
  } catch {
    alert('Something went wrong');
  } finally {
    setGeneratingAI(false);
  }
};
if (!appActive) {
  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1>Service temporarily unavailable</h1>
      <p>Please contact the administrator to reactivate this service.</p>
    </main>
  );
}
  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand">QuotePilot</div>
        <div className="badge">MVP v0.1</div>
      </div>
      <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
  <a href="/quotes">Saved quotations</a>
  <a href="/customers">Customers</a>
</div>

      <main className="main">
        <section className="panel editor-panel">
          <h2>Create quotation</h2>

          <div className="grid2">
            <div className="field">
              <label>Business name</label>
              <input
  value={businessName}
  onChange={(e) => setBusinessName(e.target.value)}
  onBlur={() => localStorage.setItem('businessName', businessName)}
/>
            </div>
            <div className="field">
              <label>Quote number</label>
              <input value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} />
            </div>
          </div>
<div className="field">
  <label>Select saved customer</label>

  <select
    value={selectedCustomerId}
    onChange={(e) => chooseCustomer(e.target.value)}
  >
    <option value="">Choose customer</option>

    {customers.map((customer) => (
      <option key={customer.id} value={customer.id}>
        {customer.name}
      </option>
    ))}
  </select>
</div>
          <div className="grid2">
            <div className="field">
              <label>Customer name</label>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div className="field">
              <label>Customer email</label>
              <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid2">
  <div className="field">
    <label>Customer phone</label>
    <input
      value={customerPhone}
      onChange={(e) => setCustomerPhone(e.target.value)}
    />
  </div>

  <div className="field">
    <label>Customer company</label>
    <input
      value={customerCompany}
      onChange={(e) => setCustomerCompany(e.target.value)}
    />
  </div>
</div>

          <div className="grid2">
            <div className="field">
              <label>Valid until</label>
              <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
            <div className="field">
              <label>VAT %</label>
              <input type="number" min="0" step="0.1" value={vatRate} onChange={(e) => setVatRate(Number(e.target.value || 0))} />
            </div>
          </div>

          <div className="items">
            <label>Line items</label>
            {items.map((item, index) => (
              <div className="item-row" key={index}>
                <div className="field">
                  <input placeholder="Service or product" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} />
                </div>
                <div className="field">
                  <input type="number" min="0" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} />
                </div>
                <div className="field">
                  <input type="number" min="0" step="0.01" placeholder="Price" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} />
                </div>
                <button className="icon-btn" onClick={() => removeItem(index)} aria-label="Remove item">×</button>
              </div>
            ))}
       
          </div>

          <div className="field" style={{ marginTop: 18 }}>
            <label>Notes / terms</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="actions">
            <button className="primary" onClick={() => window.print()}>Print / Save as PDF</button><button
              type="button"
  onClick={() => {
    setSelectedCustomerId('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerCompany('');
    setItems([{ description: '', quantity: 1, price: 0 }]);
    setNotes('');
  }}
>
  Reset form
</button>

<button
 
  type="button"
  onClick={generateWithAI}
  disabled={generatingAI}
  style={{
    padding: '12px 20px',
    cursor: 'pointer',
    marginRight: 10,
  }}
>
  {generatingAI ? 'Generating...' : 'Generate with AI'}
</button>
            <button
  className="secondary"
  onClick={saveQuote}
  disabled={savingQuote}
>
  {savingQuote ? 'Saving...' : 'Save quote'}
</button>
          </div>
        </section>

        <section className="panel preview-panel">
          <div className="quote">
            <div className="quote-head">
              <div>
                <div className="quote-title">QUOTATION</div>
                <div className="muted">{businessName}</div>
              </div>
              <div className="meta">
                <div><strong>Quote:</strong> {quoteNumber}</div>
                <div><strong>Valid until:</strong> {validUntil || '—'}</div>
              </div>
            </div>

            <div className="block">
              <div className="block-title">Prepared for</div>
              <div className="customer">{customerName || 'Customer name'}</div>
              <div className="muted">{customerEmail || 'Customer email'}</div>
            </div>



            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="num">Qty</th>
                  <th className="num">Unit price</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description || 'Untitled item'}</td>
                    <td className="num">{item.quantity}</td>
                    <td className="num">{money(item.price)}</td>
                    <td className="num">{money(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals">
              <div className="total-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              <div className="total-row"><span>VAT ({vatRate}%)</span><strong>{money(vat)}</strong></div>
              <div className="total-row grand"><span>Total</span><span>{money(total)}</span></div>
            </div>

            <div className="block">
              <div className="block-title">Notes & terms</div>
              <div className="notes">{notes}</div>
            </div>

            <div className="footer-note">Generated with QuotePilot MVP</div>
          </div>
        </section>
      </main>
    </div>
  );
}
