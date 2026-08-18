/**
 * SkillSwap — Create Profile form (multi-step)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMultiStepForm();
  initSkillInputs();
});

let currentStep = 1;
const totalSteps = 3;
const teachSkills = [];
const learnSkills = [];

function initMultiStepForm() {
  const prevBtn = document.getElementById('prev-step');
  const nextBtn = document.getElementById('next-step');
  const submitBtn = document.getElementById('submit-form');
  const form = document.getElementById('create-profile-form');

  prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) goToStep(currentStep + 1);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const profile = {
      firstName: document.getElementById('first-name').value.trim(),
      lastName: document.getElementById('last-name').value.trim(),
      location: document.getElementById('location').value.trim(),
      bio: document.getElementById('bio').value.trim(),
      teach: [...teachSkills],
      learn: [...learnSkills]
    };

    localStorage.setItem('skillswap-profile', JSON.stringify(profile));
    showToast('Profile created! Finding your matches...');

    setTimeout(() => {
      window.location.href = 'matches.html';
    }, 1500);
  });
}

function goToStep(step) {
  if (step < 1 || step > totalSteps) return;

  currentStep = step;

  document.querySelectorAll('.form-step').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.step) === step);
  });

  document.querySelectorAll('.form-progress-step').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.step) <= step);
  });

  document.getElementById('prev-step').style.visibility = step === 1 ? 'hidden' : 'visible';
  document.getElementById('next-step').style.display = step === totalSteps ? 'none' : 'inline-flex';
  document.getElementById('submit-form').style.display = step === totalSteps ? 'inline-flex' : 'none';
}

function validateStep(step) {
  if (step === 1) {
    const first = document.getElementById('first-name').value.trim();
    const last = document.getElementById('last-name').value.trim();
    const location = document.getElementById('location').value.trim();
    const bio = document.getElementById('bio').value.trim();

    if (!first || !last) {
      showToast('Please enter your name.', 'error');
      return false;
    }
    if (!location) {
      showToast('Please enter your location.', 'error');
      return false;
    }
    if (bio.length < 20) {
      showToast('Bio must be at least 20 characters.', 'error');
      return false;
    }
    return true;
  }

  if (step === 2) {
    if (teachSkills.length === 0) {
      showToast('Add at least one skill you can teach.', 'error');
      return false;
    }
    return true;
  }

  if (step === 3) {
    if (learnSkills.length === 0) {
      showToast('Add at least one skill you want to learn.', 'error');
      return false;
    }
    return true;
  }

  return true;
}

function initSkillInputs() {
  setupSkillInput('teach-input', 'add-teach', 'teach-skills', teachSkills, 'popular-teach');
  setupSkillInput('learn-input', 'add-learn', 'learn-skills', learnSkills, 'popular-learn');
}

function setupSkillInput(inputId, btnId, containerId, skillsArray, popularId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const container = document.getElementById(containerId);
  const popular = document.getElementById(popularId);

  function addSkill(value) {
    const skill = value.trim();
    if (!skill || skillsArray.includes(skill)) return;
    skillsArray.push(skill);
    renderSelectedSkills(container, skillsArray);
    input.value = '';
  }

  btn.addEventListener('click', () => addSkill(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(input.value);
    }
  });

  popular?.addEventListener('click', e => {
    const chip = e.target.closest('[data-skill]');
    if (chip) addSkill(chip.dataset.skill);
  });
}

function renderSelectedSkills(container, skills) {
  container.innerHTML = skills.map((s, i) => `
    <span class="selected-skill">
      ${s}
      <button type="button" data-index="${i}" aria-label="Remove ${s}">&times;</button>
    </span>
  `).join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      skills.splice(parseInt(btn.dataset.index), 1);
      renderSelectedSkills(container, skills);
    });
  });
}
