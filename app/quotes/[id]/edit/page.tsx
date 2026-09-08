'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type LineItem = {
  description: string;
  quantity: number;
  price: number;
};

type Quotation = {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string;
  items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: string;
};

export default function EditQuotePage() {
  const params = useParams();
  const router = useRouter();

  const [quoteNumber, setQuoteNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [vatRate, setVatRate] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    if (!params.id) return;
    try {
      const response = await fetch('/api/quotes', {
  cache: 'no-store',
});
if (!response.ok) {
  throw new Error('Could not load quotations');
}
      const result = await response.json();

      const foundQuote = result.quotations?.find(
        (item: Quotation) => String(item.id) === String(params.id)
      );

      if (!foundQuote) {
        alert('Quotation not found');
        router.push('/quotes');
      return;
}

setQuoteNumber(foundQuote.quote_number || '');
setCustomerName(foundQuote.customer_name || '');
setCustomerEmail(foundQuote.customer_email || '');
setCustomerPhone(foundQuote.customer_phone || '');
setCustomerCompany(foundQuote.customer_company || '');
setItems(foundQuote.items || []);

      const savedSubtotal = Number(foundQuote.subtotal || 0);
      const savedVat = Number(foundQuote.vat || 0);

      if (savedSubtotal > 0) {
        setVatRate((savedVat / savedSubtotal) * 100);
      }
    } catch {
      alert('Could not load quotation');
    } finally {
      setLoading(false);
    }
  };
  

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + Number(item.quantity) * Number(item.price),
      0
    );
  }, [items]);

  const vat = useMemo(() => {
    return subtotal * (Number(vatRate) / 100);
  }, [subtotal, vatRate]);

  const total = subtotal + vat;

  const updateItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === 'description'
                  ? value
                  : Number(value),
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        description: '',
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const saveChanges = async () => {
    setSaving(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
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
        alert(result.error || 'Could not save changes');
        return;
      }

      alert('Quotation updated successfully');

      router.push(`/quotes/${params.id}`);
    } catch {
      alert('Something went wrong while updating');
    } finally {
      setSaving(false);
    }
  };
 
  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        Loading quotation...
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <a href={`/quotes/${params.id}`}>
        ← Back to quotation
      </a>

      <h1 style={{ marginTop: 30 }}>
        Edit quotation
      </h1>

      <div style={fieldStyle}>
        <label>Quote number</label>

        <input
          value={quoteNumber}
          onChange={(e) => setQuoteNumber(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Customer name</label>

        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Customer email</label>
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

        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>VAT %</label>

        <input
          type="number"
          value={vatRate}
          onChange={(e) => setVatRate(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <h2 style={{ marginTop: 35 }}>Items</h2>

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr auto',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <input
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              updateItem(index, 'description', e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="number"
            min="0"
            value={item.quantity}
            onChange={(e) =>
              updateItem(index, 'quantity', e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={item.price}
            onChange={(e) =>
              updateItem(index, 'price', e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={() => removeItem(index)}
            type="button"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        type="button"
        style={{ marginTop: 10 }}
      >
        Add item
      </button>

      <div
        style={{
          marginTop: 35,
          paddingTop: 20,
          borderTop: '1px solid #ddd',
        }}
      >
        <p>
          Subtotal: AED {subtotal.toFixed(2)}
        </p>

        <p>
          VAT: AED {vat.toFixed(2)}
        </p>

        <h2>
          Total: AED {total.toFixed(2)}
        </h2>
      </div>

      <button
        onClick={saveChanges}
        disabled={saving}
        style={{
          marginTop: 25,
          padding: '12px 20px',
          cursor: 'pointer',
        }}
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </main>
  );
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 6,
  marginBottom: 18,
};

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
};