document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#loanApplication');
  if (!form) return;
  const panels = [...form.querySelectorAll('[data-step-panel]')];
  const stepLabels = [...document.querySelectorAll('[data-step-label]')];
  const progress = document.querySelector('#applicationProgress');
  let current = 0;

  const showStep = index => {
    current = index;
    panels.forEach((panel, i) => panel.classList.toggle('hidden', i !== current));
    stepLabels.forEach((label, i) => label.classList.toggle('current', i === current));
    if (progress) progress.style.width = `${((current + 1) / panels.length) * 100}%`;
    window.scrollTo({ top: form.offsetTop - 110, behavior: 'smooth' });
  };

  form.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => {
    const panel = panels[current];
    const required = [...panel.querySelectorAll('[required]')];
    let valid = true;
    required.forEach(field => {
      field.classList.toggle('is-invalid', !field.checkValidity());
      if (!field.checkValidity()) valid = false;
    });
    if (valid && current < panels.length - 1) showStep(current + 1);
  }));
  form.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => { if (current > 0) showStep(current - 1); }));

  const businessFields = document.querySelector('#businessFields');
  form.querySelectorAll('input[name="loanType"]').forEach(input => input.addEventListener('change', () => {
    businessFields.classList.toggle('hidden', input.value !== 'business' || !input.checked);
  }));

  const country = document.querySelector('#country');
  const countryNote = document.querySelector('#countryNote');
  if (country) country.addEventListener('change', () => countryNote.classList.toggle('hidden', ['US', 'CA'].includes(country.value)));

  const review = document.querySelector('#reviewSummary');
  const buildReview = () => {
    if (!review) return;
    const values = [...form.querySelectorAll('input, select, textarea')].filter(field => field.value && field.type !== 'file');
    review.innerHTML = values.slice(0, 18).map(field => `<div class="d-flex justify-content-between border-bottom py-2"><span class="muted">${field.labels?.[0]?.textContent || field.name}</span><strong>${field.value}</strong></div>`).join('');
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const requiredConsents = [...form.querySelectorAll('.form-check-input[required], #consentAccuracy')];
    const hasAllConsents = requiredConsents.every(consent => {
      consent.classList.toggle('is-invalid', !consent.checked);
      return consent.checked;
    });
    if (!hasAllConsents) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Application submission failed');

      buildReview();
      const id = `APP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      document.querySelector('#applicationId').textContent = id;
      document.querySelector('#statusLink').href = `status.html?id=${id}`;
      document.querySelector('#applicationFormView').classList.add('hidden');
      document.querySelector('#successView').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      let errorMessage = document.querySelector('#submissionError');
      if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'submissionError';
        errorMessage.className = 'alert alert-danger mt-3';
        form.querySelector('[data-step-panel]:not(.hidden)').prepend(errorMessage);
      }
      errorMessage.textContent = 'We could not submit your application right now. Please check your connection and try again.';
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
  showStep(0);
});
