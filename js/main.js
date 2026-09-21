document.addEventListener('DOMContentLoaded', () => {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
  });

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  document.querySelectorAll('[data-toast]').forEach(button => {
    button.addEventListener('click', () => {
      const message = button.dataset.toast;
      const toast = document.createElement('div');
      toast.className = 'position-fixed bottom-0 end-0 m-3 alert alert-primary shadow-sm';
      toast.setAttribute('role', 'status');
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
    });
  });

  document.querySelectorAll('[data-file-input]').forEach(input => {
    input.addEventListener('change', () => {
      const target = document.querySelector(input.dataset.fileInput);
      if (!target) return;
      const file = input.files[0];
      target.textContent = file ? `${file.name} (${Math.ceil(file.size / 1024)} KB) - mock upload selected` : 'No file selected';
    });
  });
});
