// Load saved customer info from localStorage
function loadCustomerInfo() {
  ['custName', 'custContact', 'custAddress', 'custDate'].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved !== null) {
      document.getElementById(id).textContent = saved;
    }
  });
}

// Edit any field (Name, Contact, Address)
function editField(id, label) {
  const current = document.getElementById(id).textContent;
  const updated = prompt(`Enter ${label}:`, current);
  if (updated === null || updated.trim() === "") return;

  // Validate mobile number
  if (id === 'custContact') {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(updated)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
  }

  document.getElementById(id).textContent = updated;
  localStorage.setItem(id, updated);
}

function editDateField(id) {
  // Create a hidden input element of type date
  const input = document.createElement("input");
  input.type = "date";
  input.style.position = "absolute";
  input.style.opacity = 0;
  input.style.pointerEvents = "none";
  document.body.appendChild(input);

  // Set current value from existing field
  const currentText = document.getElementById(id).textContent;
  input.value = formatDateForInput(currentText);

  // When user selects a new date
  input.addEventListener("change", () => {
    if (input.value) {
      const formatted = formatDateDisplay(input.value);
      document.getElementById(id).textContent = formatted;
      localStorage.setItem(id, formatted);
    }
    input.remove(); // Clean up
  });

  input.click(); // Trigger calendar popup
}


// Delete field content with confirmation
function deleteField(id, label) {
  if (confirm(`Are you sure you want to delete ${label}?`)) {
    document.getElementById(id).textContent = "";
    localStorage.removeItem(id);
  }
}

// Converts DD/MM/YY ➜ YYYY-MM-DD (for <input type="date">)
function formatDateForInput(displayDate) {
  const parts = displayDate.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
    return `${year}-${month}-${day}`;
  }
  return "";
}

// Converts YYYY-MM-DD ➜ DD/MM/YY
function formatDateDisplay(inputDate) {
  const d = new Date(inputDate);
  if (!isNaN(d)) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }
  return "";
}


// Initialize on page load
loadCustomerInfo();


// Initial render
  renderProducts();

  // Show items from localStorage (added in products.html)
  function renderProducts(filter = "") {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    const cartProducts = JSON.parse(localStorage.getItem("vetriCart")) || [];
    const filtered = cartProducts.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(product => {
      const amount = product.rate + product.tax;
      const row = document.createElement("div");
      row.className = "product-row";
      row.innerHTML = `
        <span>${product.name}</span>
        <span>${product.quantity}</span>
        <span>${product.rate}</span>
        <span>${product.tax}</span>
        <span>${amount}</span>
      `;
      list.appendChild(row);
    });
  }

  // Search input filter
  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderProducts(e.target.value);
  });

  // Clear cart on next
  document.querySelector(".next-btn").addEventListener("click", () => {
    localStorage.removeItem("vetriCart");
    alert("Proceeding to next step...");
    renderProducts(); // Optional: clear displayed list
  });

  window.location.href = "billing.html";

  