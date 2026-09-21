// Shared validation helpers can be connected to a production form service here.
function markInvalid(field, message) {
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  if (message) field.setAttribute('aria-describedby', `${field.id}-error`);
}
