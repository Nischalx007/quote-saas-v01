'use client';

import { useEffect, useState } from 'react';

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
};
type EditingCustomer = Customer | null;
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<EditingCustomer>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const result = await response.json();

      if (result.success) {
        setCustomers(result.customers);
      }
    } catch {
      console.error('Could not load customers');
    } finally {
      setLoading(false);
    }
  };

  const saveCustomer = async () => {
    if (!name.trim()) {
      alert('Please enter customer name');
      return;
    }

    setSaving(true);

    try {
const response = await fetch('/api/customers', {
  method: editingCustomer ? 'PATCH' : 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: editingCustomer?.id,
    name,
    email,
    phone,
    companyName,
  }),
});
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Could not save customer');
        return;
      }

      alert('Customer saved successfully');
      setEditingCustomer(null);
      setName('');
      setEmail('');
      setPhone('');
      setCompanyName('');

      loadCustomers();
    } catch {
      alert('Something went wrong');
    } finally {
      setSaving(false);
    }
  };
const filteredCustomers = customers.filter((customer) => {
  const searchText = search.toLowerCase();

  return (
    customer.name?.toLowerCase().includes(searchText) ||
    customer.email?.toLowerCase().includes(searchText) ||
    customer.phone?.toLowerCase().includes(searchText) ||
    customer.company_name?.toLowerCase().includes(searchText)
  );
});
const startEditCustomer = (customer: Customer) => {

  setEditingCustomer(customer);
  setName(customer.name || '');
  setEmail(customer.email || '');
  setPhone(customer.phone || '');
  setCompanyName(customer.company_name || '');
};
  const deleteCustomer = async (id: number) => {
  const confirmed = window.confirm('Delete this customer?');

  if (!confirmed) return;

  try {
    const response = await fetch('/api/customers', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || 'Could not delete customer');
      return;
    }

    loadCustomers();
  } catch {
    alert('Something went wrong');
  }
};
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: '0 auto',
        padding: '40px 24px',
      }}
    >
      <h1>Customers</h1>
      <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
  <a href="/">Create quotation</a>
  <a href="/quotes">Saved quotations</a>
</div>
<a href="/quotes">
  Saved quotations
</a>
      <h2 style={{ marginTop: 30 }}>Add customer</h2>

      <div style={fieldStyle}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Company name</label>
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        onClick={saveCustomer}
        disabled={saving}
        style={{
          padding: '12px 20px',
          cursor: 'pointer',
        }}
      >
        {saving
  ? 'Saving...'
  : editingCustomer
  ? 'Update customer'
  : 'Save customer'}
      </button>

      <hr style={{ margin: '40px 0' }} />

      <h2>Saved customers</h2>
<input
  type="text"
  placeholder="Search customers..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: '100%',
    maxWidth: 400,
    padding: '10px 12px',
    marginTop: 15,
    marginBottom: 20,
  }}
/>
      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p>No customers saved yet.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: 20,
          }}
        >
          <thead>
            <tr>
              <th style={headerStyle}>Name</th>
              <th style={headerStyle}>Email</th>
              <th style={headerStyle}>Phone</th>
              <th style={headerStyle}>Company</th>
              <th style={headerStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td style={cellStyle}>{customer.name}</td>
                <td style={cellStyle}>{customer.email}</td>
                <td style={cellStyle}>{customer.phone}</td>
                <td style={cellStyle}>{customer.company_name}</td>
                <td style={cellStyle}>
  <button onClick={() => startEditCustomer(customer)}>
    Edit
  </button>

  <button
    onClick={() => deleteCustomer(customer.id)}
    style={{ marginLeft: 8 }}
  >
    Delete
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 6,
  marginBottom: 16,
};

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
};

const headerStyle = {
  textAlign: 'left' as const,
  padding: '12px',
  borderBottom: '2px solid #ddd',
};

const cellStyle = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
};