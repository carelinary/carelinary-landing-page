const toggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? '✕' : '☰';
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = '☰';
}));

const days = document.querySelector('#days');
const slots = document.querySelector('#slots');
function updateCalc() {
  const meals = Number(days.value) * Number(slots.value);
  document.querySelector('#total').textContent = new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(meals * 80000);
  document.querySelector('#meal-count').textContent = `${meals} meals × Rp80.000`;
}
days?.addEventListener('change', updateCalc);
slots?.addEventListener('change', updateCalc);
if (days && slots) updateCalc();
document.querySelector('#year').textContent = new Date().getFullYear();

const scenes = [
  ['assets/scene-01-bahan-organik.mp4', 'Ilustrasi konsep · Seleksi bahan'],
  ['assets/scene-02-profil-gizi.mp4', 'Ilustrasi konsep · Profil nutrisi'],
  ['assets/scene-03-chef.mp4', 'Ilustrasi konsep · Persiapan oleh chef'],
  ['assets/scene-04-hidangan.mp4', 'Ilustrasi konsep · Penyajian hidangan'],
  ['assets/scene-05-pengantaran.mp4', 'Ilustrasi konsep · Pengantaran']
];
const film = document.querySelector('#hero-film');
const filmToggle = document.querySelector('#film-toggle');
const filmCaption = document.querySelector('#film-caption');
let sceneIndex = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setFilmButton(paused) {
  filmToggle.textContent = paused ? 'Putar video' : 'Jeda video';
  filmToggle.setAttribute('aria-label', paused ? 'Putar video' : 'Jeda video');
}
if (film) {
  if (reducedMotion) {
    film.pause();
    setFilmButton(true);
  } else {
    film.play().catch(() => setFilmButton(true));
  }
  film.addEventListener('ended', () => {
    sceneIndex = (sceneIndex + 1) % scenes.length;
    film.src = scenes[sceneIndex][0];
    filmCaption.textContent = scenes[sceneIndex][1];
    film.load();
    film.play().catch(() => setFilmButton(true));
  });
  film.addEventListener('error', () => {
    film.style.display = 'none';
    filmToggle.style.display = 'none';
    filmCaption.textContent = 'Ilustrasi hidangan Carelinary';
  });
  filmToggle.addEventListener('click', () => {
    if (film.paused) film.play().then(() => setFilmButton(false)).catch(() => setFilmButton(true));
    else { film.pause(); setFilmButton(true); }
  });
}

const privacy = document.querySelector('#privacy-dialog');
const thanks = document.querySelector('#thankyou-dialog');
document.querySelectorAll('[data-open-privacy]').forEach(button => button.addEventListener('click', () => privacy.showModal()));
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
for (const dialog of [privacy, thanks]) {
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

const form = document.querySelector('#interest-form');
const submit = document.querySelector('#submit-interest');
const status = document.querySelector('#form-status');
const feedback = document.querySelector('#form-feedback');
let formEnabled = false;
let pendingSubmissionId = null;
async function checkRegistration() {
  try {
    const response = await fetch('/api/interest', { cache: 'no-store' });
    const data = await response.json();
    formEnabled = response.ok && data.enabled === true;
  } catch { formEnabled = false; }
  status.textContent = formEnabled
    ? 'Pendaftaran minat sudah dibuka. Kami akan menghubungi Anda setelah program tersedia.'
    : 'Pendaftaran belum dibuka. Sistem penyimpanan data sedang disiapkan; mohon kembali lagi nanti.';
  submit.disabled = !formEnabled;
  submit.textContent = formEnabled ? 'Daftar Waiting List ↗' : 'Pendaftaran belum dibuka';
}
checkRegistration();

form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!formEnabled || !form.reportValidity()) return;
  feedback.textContent = '';
  submit.disabled = true;
  submit.textContent = 'Mengirim…';
  const data = new FormData(form);
  const payload = {
    submission_id: pendingSubmissionId || crypto.randomUUID(),
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    address: String(data.get('address') || '').trim(),
    program: String(data.get('program') || ''),
    duration: String(data.get('duration') || ''),
    meals: String(data.get('meals') || ''),
    consent: data.get('consent') === 'on',
    website: String(data.get('website') || '')
  };
  pendingSubmissionId = payload.submission_id;
  try {
    const response = await fetch('/api/interest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true || result.submission_id !== payload.submission_id) {
      throw new Error(result.error || 'Pendaftaran belum dapat diproses.');
    }
    form.reset();
    pendingSubmissionId = null;
    thanks.showModal();
  } catch (error) {
    feedback.textContent = error.message || 'Koneksi terganggu. Silakan coba lagi.';
  } finally {
    submit.disabled = !formEnabled;
    submit.textContent = formEnabled ? 'Daftar Waiting List ↗' : 'Pendaftaran belum dibuka';
  }
});
