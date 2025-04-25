const sheetURL = `https://script.google.com/macros/s/AKfycbzU0UE_su67iDiL2QRWfmcOQ-m8t_ciPi6bp7Lf2tPDAFjf64muKi9R3kv9oGErubGpNA/exec`;

    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }
    function submitNIM() {
      const nim = document.getElementById('input-nim').value.trim();
      if (nim) {
        // Ganti URL tanpa reload halaman
        window.history.replaceState(null, null, `?id=${nim}`);
        document.getElementById('modal-nim').style.display = 'none';
        fetchDataById(nim);
      } else {
        alert("Silakan masukkan NIM terlebih dahulu.");
      }
    }
    
    // Ambil ID dari URL jika ada
    window.addEventListener('DOMContentLoaded', () => {
      const id = getQueryParam('id');
      if (!id) {
        document.getElementById('modal-nim').style.display = 'flex';
      } else {
        fetchDataById(id);
      }
    });
    
    // Pisahkan fungsi fetch supaya bisa dipanggil dari modal
    function fetchDataById(id) {
      fetch(sheetURL)
        .then(res => res.json())
        .then(data => tampilkanData(data))
        .catch(err => {
          console.error('Gagal ambil data:', err);
        });
    }
    

    function tampilkanData(data) {
      const id = getQueryParam('id');
      const item = data.find(row => row.ID == id); // gunakan == agar tidak ketat ke tipe data

      if (item) {
        document.getElementById('nama').textContent = item['Nama Lengkap'];
        document.getElementById('jabatan').textContent = item['Jabatan'];
      } else {
        document.getElementById('nama').textContent = 'DATA TIDAK DITEMUKAN';
        document.getElementById('jabatan').textContent = 'DATA TIDAK DITEMUKAN';
      }
    }

    fetch(sheetURL)
      .then(res => res.json())
      .then(data => tampilkanData(data))
      .catch(err => {
        console.error('Gagal ambil data:', err);
      });

    function downloadSertifikatpdf() {
        const element = document.querySelector("#sertifikat-container");
      
        html2canvas(element).then(canvas => {
          const imgData = canvas.toDataURL("image/png");
      
          const pdf = new jspdf.jsPDF({
            orientation: "landscape", // atau "portrait" sesuai ukuran sertifikat
            unit: "mm",
            format: [210, 297] // Ukuran A4 dalam mm: [tinggi, lebar] untuk landscape
          });
      
          // Sesuaikan ukuran gambar ke PDF
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
      
          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
          const nama = document.getElementById('nama').textContent.trim().replace(/\s+/g, '_');
          pdf.save(`sertifikat_${nama}.pdf`);
        });
      }

      function downloadSertifikatpng() {
        html2canvas(document.querySelector("#sertifikat-container")).then(canvas => {
          const link = document.createElement("a");
          const nama = document.getElementById('nama').textContent.trim().replace(/\s+/g, '_');
          link.download = `sertifikat_${nama}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        });
      }
      

    