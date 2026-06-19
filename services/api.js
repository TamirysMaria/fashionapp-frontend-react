import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.199:3000/api/livros'
});

export default api

export async function getEntries() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return res.json();
}

export async function getEntryById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  return res.json();
}

export async function createEntry(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return res.json();
}

export async function updateEntry(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar produto');
  return res.json();
}

export async function deleteEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao excluir produto');
  return res.json();
}
