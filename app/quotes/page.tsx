'use client';

import { useEffect, useState } from 'react';

type Quotation = {
  id: number;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  subtotal: number;
  vat: number;
  total: number;
  status: string;
  created_at: string;
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      const response = await fetch('/api/quotes');
      const result = await response.json();

      if (result.success) {
        setQuotations(result.quotations);
      }
    } catch (error) {
      console.error('Could not load quotations', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {

    return (
      <main style={{ padding: '40px' }}>
        <h1>Saved Quotations</h1>
        <a href="/" style={{ display: 'inline-block', marginBottom: 20 }}>
  Create new quotation
</a>

<a
  href="/customers"
  style={{
    display: 'inline-block',
    marginLeft: 15,
  }}
>
  Customers
</a>
        <p>Loading...</p>
      </main>
    );
  }
const filteredQuotations = quotations.filter((quote) => {
  const searchText = search.toLowerCase();

  return (
    quote.quote_number?.toLowerCase().includes(searchText) ||
    quote.customer_name?.toLowerCase().includes(searchText) ||
    quote.customer_email?.toLowerCase().includes(searchText) ||
    quote.status?.toLowerCase().includes(searchText)
  );
});
  return (
    <main
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <h1>Saved Quotations</h1>
      <a
  href="/"
  style={{
    display: 'inline-block',
    marginTop: 10,
    marginBottom: 25,
  }}
>
  Create new quotation
</a>
<input



  type="text"



  placeholder="Search quotations..."



  value={search}



  onChange={(e) => setSearch(e.target.value)}



  style={{



    width: '100%',



    maxWidth: 400,



    padding: '10px 12px',



    marginBottom: 20,



  }}



/>
      <p style={{ marginBottom: '30px' }}>
        {filteredQuotations.length} quotation(s) found
      </p>

      {quotations.length === 0 ? (
        <p>No quotations saved yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Quote</th>
                <th style={headerStyle}>Customer</th>
                <th style={headerStyle}>Email</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Date</th>
                <th style={headerStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuotations.map((quote) => (
                <tr key={quote.id}>
                  <td style={cellStyle}>{quote.quote_number}</td>
                  <td style={cellStyle}>{quote.customer_name}</td>
                  <td style={cellStyle}>{quote.customer_email}</td>
                  <td style={cellStyle}>
                    AED {Number(quote.total).toFixed(2)}
                  </td>
                  <td style={cellStyle}>{quote.status}</td>
                  <td style={cellStyle}>
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                  <td style={cellStyle}>
<a
  href={`/quotes/${quote.id}`}
  style={{ color: '#2563eb', textDecoration: 'underline' }}
>
  View
</a>                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const headerStyle = {
  textAlign: 'left' as const,
  padding: '14px',
  borderBottom: '2px solid #ddd',
};

const cellStyle = {
  padding: '14px',
  borderBottom: '1px solid #ddd',
};

