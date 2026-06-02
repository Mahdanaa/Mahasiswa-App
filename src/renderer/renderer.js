const api = window.api;
const form = document.getElementById('form-mahasiswa');
const tbody = document.getElementById('table-body');
const editId = document.getElementById('edit-id');
const inputNim = document.getElementById('nim');
const inputNama = document.getElementById('nama');
const inputIpk = document.getElementById('ipk');
const inputJurusan = document.getElementById('jurusan');
const inputAngkatan = document.getElementById('angkatan');
const clearButton = document.getElementById('btn-clear');

const pesanError = document.getElementById('pesan-error');

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
  <td>${mahasiswa.ipk}</td>
  <td>${escapeHtml(mahasiswa.jurusan)}</td>
  <td>${mahasiswa.angkatan}</td>
  <td>
    <button class="btn-edit" type="button">Edit</button>
    <button class="btn-delete" type="button">Hapus</button>
  </td>
`;
    row.querySelector('.btn-edit').addEventListener('click', () => {
      editRow(mahasiswa.id, mahasiswa.nim, mahasiswa.nama, mahasiswa.ipk, mahasiswa.jurusan, mahasiswa.angkatan);
    });
    row.querySelector('.btn-delete').addEventListener('click', () => {
      deleteRow(mahasiswa.id);
    });
    tbody.appendChild(row);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  pesanError.style.display = 'none';

  const payload = {
    nim: inputNim.value,
    nama: inputNama.value,
    jurusan: inputJurusan.value,
    ipk: Number(inputIpk.value),
    angkatan: Number(inputAngkatan.value),
  };

  try {
    if (editId.value) {
      await api.update(Number(editId.value), payload);
    } else {
      await api.insert(payload);
    }

    resetForm();
    await loadTable();
  } catch (error) {
    pesanError.innerText = 'Gagal menyimpan! NIM ini sudah terdaftar.';
    pesanError.style.display = 'block';
    console.error(error);
  }
});

function editRow(id, nim, nama, ipk, jurusan, angkatan) {
  editId.value = String(id);
  inputNim.value = nim;
  inputNama.value = nama;
  inputIpk.value = String(ipk);
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
  pesanError.style.display = 'none';
}

clearButton.addEventListener('click', resetForm);
loadTable();
