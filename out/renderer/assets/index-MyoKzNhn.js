const api = window.api;
const form = document.getElementById("form-mahasiswa");
const tbody = document.getElementById("table-body");
const editId = document.getElementById("edit-id");
const inputNim = document.getElementById("nim");
const inputNama = document.getElementById("nama");
const inputIpk = document.getElementById("ipk");
const inputJurusan = document.getElementById("jurusan");
const inputAngkatan = document.getElementById("angkatan");
const clearButton = document.getElementById("btn-clear");
const searchInput = document.getElementById("search-input");
const pesanError = document.getElementById("pesan-error");
function tampilkanError(pesan) {
  pesanError.innerText = pesan;
  pesanError.style.display = "block";
}
function escapeHtml(value) {
  return String(value).replaceAll("&", "&").replaceAll("<", "<").replaceAll(">", ">").replaceAll('"', '"').replaceAll("'", "&#39;");
}
async function loadTable(dataCustom = null) {
  const data = dataCustom || await api.getAll();
  tbody.innerHTML = "";
  for (const mahasiswa of data) {
    const row = document.createElement("tr");
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
    row.querySelector(".btn-edit").addEventListener("click", () => {
      editRow(mahasiswa.id, mahasiswa.nim, mahasiswa.nama, mahasiswa.ipk, mahasiswa.jurusan, mahasiswa.angkatan);
    });
    row.querySelector(".btn-delete").addEventListener("click", () => {
      deleteRow(mahasiswa.id);
    });
    tbody.appendChild(row);
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  pesanError.style.display = "none";
  const ipkValue = Number(inputIpk.value);
  const angkatanValue = Number(inputAngkatan.value);
  if (ipkValue < 0 || ipkValue > 4) {
    tampilkanError("Gagal: Nilai IPK harus di antara 0.00 sampai 4.00!");
    return;
  }
  if (angkatanValue < 2e3 || angkatanValue > 3e3) {
    tampilkanError("Gagal: Tahun angkatan tidak masuk akal!");
    return;
  }
  const payload = {
    nim: inputNim.value.trim(),
    nama: inputNama.value.trim(),
    jurusan: inputJurusan.value.trim(),
    ipk: ipkValue,
    angkatan: angkatanValue
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
    console.error("Error dari database:", error);
    if (error.message.includes("sudah terdaftar") || error.message.includes("UNIQUE")) {
      tampilkanError("Gagal: NIM ini sudah terdaftar di sistem!");
    } else {
      tampilkanError(`Kesalahan Sistem: ${error.message}`);
    }
  }
});
function editRow(id, nim, nama, ipk, jurusan, angkatan) {
  editId.value = String(id);
  inputNim.value = nim;
  inputNama.value = nama;
  inputIpk.value = String(ipk);
  inputJurusan.value = jurusan;
  inputAngkatan.value = String(angkatan);
  pesanError.style.display = "none";
}
async function deleteRow(id) {
  try {
    if (confirm("Yakin hapus data ini?")) {
      await api.delete(id);
      await loadTable();
    }
  } catch (error) {
    tampilkanError(`Gagal menghapus data: ${error.message}`);
  }
}
function resetForm() {
  form.reset();
  editId.value = "";
  pesanError.style.display = "none";
}
clearButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", async (event) => {
  const keyword = event.target.value;
  if (keyword.trim() !== "") {
    const hasilPencarian = await api.search(keyword);
    await loadTable(hasilPencarian);
  } else {
    await loadTable();
  }
});
loadTable();
