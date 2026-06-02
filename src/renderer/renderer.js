const api = window.api;
const form = document.getElementById('form-mahasiswa');
const tbody = document.getElementById('table-body');
const editId = document.getElementById('edit-id');
const inputNim = document.getElementById('nim');
const inputNama = document.getElementById('nama');
const inputJurusan = document.getElementById('jurusan');
const inputAngkatan = document.getElementById('angkatan');
const clearButton = document.getElementById('btn-clear');
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#39;');
}
async function loadTable() {
  const data = await api.getAll();
  tbody.innerHTML = '';
  for (const mahasiswa of data) {
    const row = document.createElement('tr');
    row.innerHTML = `
<td>${escapeHtml(mahasiswa.nim)}</td>
<td>${escapeHtml(mahasiswa.nama)}</td>
<td>${escapeHtml(mahasiswa.jurusan)}</td>
<td>${mahasiswa.angkatan}</td>
<td>
<button class="btn-edit" type="button">Edit</button>
<button class="btn-delete" type="button">Hapus</button>
</td>
`;
    row.querySelector('.btn-edit').addEventListener('click', () => {
      editRow(mahasiswa.id, mahasiswa.nim, mahasiswa.nama, mahasiswa.jurusan, mahasiswa.angkatan);
    });
    row.querySelector('.btn-delete').addEventListener('click', () => {
      deleteRow(mahasiswa.id);
    });
    tbody.appendChild(row);
  }
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    nim: inputNim.value,
    nama: inputNama.value,
    jurusan: inputJurusan.value,
    angkatan: Number(inputAngkatan.value),
  };
  if (editId.value) {
    await api.update(Number(editId.value), payload);
  } else {
    await api.insert(payload);
  }
  resetForm();
  await loadTable();
});
function editRow(id, nim, nama, jurusan, angkatan) {
  editId.value = String(id);
  inputNim.value = nim;
  inputNama.value = nama;
  inputJurusan.value = jurusan;
  inputAngkatan.value = String(angkatan);
}
async function deleteRow(id) {
  if (confirm('Yakin hapus data ini?')) {
    await api.delete(id);
    await loadTable();
  }
}
function resetForm() {
  form.reset();
  editId.value = '';
}
clearButton.addEventListener('click', resetForm);
loadTable();
