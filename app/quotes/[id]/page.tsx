'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
  created_at: string;
};

export default function QuoteDetailPage() {
  const params = useParams();
  const [quote, setQuote] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
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

      setQuote(foundQuote || null);
    } catch (error) {
      console.error('Could not load quotation', error);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  loadQuote();
}, [params.id]);
  
const updateStatus = async (newStatus: string) => {
  if (!quote) return;

  try {
    const response = await fetch('/api/quotes', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: quote.id,
        status: newStatus,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Could not update status');
      return;
    }

    setQuote(result.quotation);
    alert(`Quotation marked as ${newStatus}`);
  } catch {
    alert('Something went wrong');
  }
};const duplicateQuote = async () => {
  if (!quote) return;

  try {
    const newQuoteNumber = `${quote.quote_number}-COPY`;

    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteNumber: newQuoteNumber,
        customerName: quote.customer_name,
        customerEmail: quote.customer_email,
        items: quote.items,
        subtotal: quote.subtotal,
        vat: quote.vat,
        total: quote.total,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Could not duplicate quotation');
      return;
    }

    alert('Quotation duplicated successfully');

    window.location.href = '/quotes';
  } catch {
    alert('Something went wrong');
  }
};

  if (loading) {
    return <main style={{ padding: 40 }}>Loading quotation...</main>;
  }

  if (!quote) {
    return <main style={{ padding: 40 }}>Quotation not found.</main>;
  }

  return (
    <main
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <a href="/quotes">← Back to quotations</a>
<a
  href={`/quotes/${quote.id}/edit`}
  style={{
    display: 'inline-block',
    marginLeft: 20,
  }}
>
  Edit quotation
</a>
      <h1 style={{ marginTop: 30 }}>
        Quotation {quote.quote_number}
      </h1>

      <p>
        <strong>Customer:</strong> {quote.customer_name}
      </p>

      <p>
        <strong>Email:</strong> {quote.customer_email}
      </p>
<p>
  <strong>Phone:</strong> {quote.customer_phone}
</p>

<p>
  <strong>Company:</strong> {quote.customer_company}
</p>

      <p>
        <strong>Status:</strong> {quote.status}
      </p>
<div
  style={{
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 15,
  }}
>
  <button onClick={() => updateStatus('draft')}>
    Draft
  </button>

  <button onClick={() => updateStatus('sent')}>
    Sent
  </button>

  <button onClick={() => updateStatus('accepted')}>
    Accepted
  </button>

  <button onClick={() => updateStatus('rejected')}>
    Rejected
  </button>
</div>
      <hr style={{ margin: '30px 0' }} />

      <h2>Items</h2>

      {quote.items?.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #ddd',
          }}
        >
          <div>
            {item.description}
            <div>Qty: {item.quantity}</div>
          </div>

          <strong>
            AED {(item.quantity * item.price).toFixed(2)}
          </strong>
        </div>
      ))}

      <div style={{ marginTop: 30 }}>
        <p>Subtotal: AED {Number(quote.subtotal).toFixed(2)}</p>

        <p>VAT: AED {Number(quote.vat).toFixed(2)}</p>

        <h2>Total: AED {Number(quote.total).toFixed(2)}</h2>
      </div>

      <button
        onClick={() => window.print()}
        style={{
          marginTop: 25,
          padding: '12px 20px',
          cursor: 'pointer',
        }}
      >
        Print / Save as PDF
      </button>

<button
  onClick={duplicateQuote}
  style={{
    marginTop: 25,
    marginLeft: 10,
    padding: '12px 20px',
    cursor: 'pointer',
  }}
>
  Duplicate quotation
</button>
    </main>
  );
}