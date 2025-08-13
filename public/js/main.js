// Main JavaScript file for CivicConnect platform

// Import Bootstrap
const bootstrap = window.bootstrap

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize tooltips if Bootstrap is loaded
  if (typeof bootstrap !== "undefined") {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert:not(.alert-permanent)")
  alerts.forEach((alert) => {
    setTimeout(() => {
      if (alert && alert.parentNode) {
        alert.style.transition = "opacity 0.5s ease"
        alert.style.opacity = "0"
        setTimeout(() => {
          if (alert.parentNode) {
            alert.parentNode.removeChild(alert)
          }
        }, 500)
      }
    }, 5000)
  })

  // Form validation enhancement
  const forms = document.querySelectorAll("form[novalidate]")
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()

        // Focus on first invalid field
        const firstInvalid = form.querySelector(":invalid")
        if (firstInvalid) {
          firstInvalid.focus()
        }
      }
      form.classList.add("was-validated")
    })
  })

  // Image preview for file uploads
  const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]')
  imageInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0]
      if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          showAlert("File size must be less than 5MB", "danger")
          input.value = ""
          return
        }

        // Show preview if preview container exists
        const previewContainer = document.getElementById("imagePreview")
        if (previewContainer) {
          const reader = new FileReader()
          reader.onload = (e) => {
            previewContainer.innerHTML = `
                            <img src="${e.target.result}" class="img-fluid rounded" 
                                 style="max-height: 200px;" alt="Preview">
                            <p class="small text-muted mt-2">Preview: ${file.name}</p>
                        `
            previewContainer.style.display = "block"
          }
          reader.readAsDataURL(file)
        }
      }
    })
  })

  // Confirm delete actions
  const deleteButtons = document.querySelectorAll("[data-confirm-delete]")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const message = button.getAttribute("data-confirm-delete") || "Are you sure you want to delete this item?"
      if (!confirm(message)) {
        event.preventDefault()
      }
    })
  })

  // Search functionality with debounce
  const searchInputs = document.querySelectorAll('input[type="search"], input[name="search"]')
  searchInputs.forEach((input) => {
    let timeout
    input.addEventListener("input", () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        // Auto-submit search form after 500ms of no typing
        const form = input.closest("form")
        if (form && input.value.length > 2) {
          // Only auto-submit if search term is longer than 2 characters
          form.submit()
        }
      }, 500)
    })
  })

  // Status update confirmation
  const statusForms = document.querySelectorAll('form[action*="/update"]')
  statusForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const statusSelect = form.querySelector('select[name="status"]')
      if (statusSelect) {
        const newStatus = statusSelect.value
        const confirmMessage = `Are you sure you want to change the status to "${newStatus}"?`
        if (!confirm(confirmMessage)) {
          event.preventDefault()
        }
      }
    })
  })

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        event.preventDefault()
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Loading state for forms
  const submitButtons = document.querySelectorAll('button[type="submit"]')
  submitButtons.forEach((button) => {
    const form = button.closest("form")
    if (form) {
      form.addEventListener("submit", () => {
        button.disabled = true
        const originalText = button.innerHTML
        button.innerHTML = '<span class="loading"></span> Processing...'

        // Re-enable button after 10 seconds (fallback)
        setTimeout(() => {
          button.disabled = false
          button.innerHTML = originalText
        }, 10000)
      })
    }
  })
})

// Utility function to show alerts
function showAlert(message, type = "info") {
  const alertContainer = document.createElement("div")
  alertContainer.className = `alert alert-${type} alert-dismissible fade show`
  alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  // Insert at top of main content
  const main = document.querySelector("main")
  if (main) {
    main.insertBefore(alertContainer, main.firstChild)
  }

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (alertContainer.parentNode) {
      alertContainer.style.opacity = "0"
      setTimeout(() => {
        if (alertContainer.parentNode) {
          alertContainer.parentNode.removeChild(alertContainer)
        }
      }, 500)
    }
  }, 5000)
}

// Function to format dates consistently
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showAlert("Copied to clipboard!", "success")
      })
      .catch(() => {
        fallbackCopyToClipboard(text)
      })
  } else {
    fallbackCopyToClipboard(text)
  }
}

// Fallback copy function for older browsers
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  textArea.style.top = "-999999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    showAlert("Copied to clipboard!", "success")
  } catch (err) {
    showAlert("Failed to copy to clipboard", "danger")
  }

  document.body.removeChild(textArea)
}

// Export functions for use in other scripts
window.CivicConnect = {
  showAlert: showAlert,
  formatDate: formatDate,
  copyToClipboard: copyToClipboard,
}
