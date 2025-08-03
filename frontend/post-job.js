document.addEventListener('DOMContentLoaded', function () {
  console.log('Post-job page loaded');

  window.logout = function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  };

  window.goBack = function () {
    window.location.href = 'dashboard.html';
  };

  let jobForm, branchChipsContainer;
  let previewTitle, previewCompany, previewDescription, previewBranches;
  let branchSelect, addBranchBtn;
  let selectedBranches = [];

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to access this page');
    window.location.href = 'login.html';
    return;
  }

  setupPage();

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload parsed successfully:', payload);

    const userNameElement = document.getElementById('userName');
    if (userNameElement && payload.name) {
      userNameElement.textContent = payload.name;
    }

    if (payload.role !== 'officer') {
      alert('Only officers can post jobs');
      window.location.href = 'dashboard.html';
    }
  } catch (e) {
    console.error('Token error:', e);
    alert('Invalid token. Please log in again.');
    window.location.href = 'login.html';
  }

  function setupPage() {
    console.log('Setting up page elements');

    jobForm = document.getElementById('jobForm');
    branchChipsContainer = document.getElementById('branchChips');
    previewTitle = document.getElementById('previewTitle');
    previewCompany = document.getElementById('previewCompany');
    previewDescription = document.getElementById('previewDescription');
    previewBranches = document.getElementById('previewBranches');
    branchSelect = document.getElementById('branchSelect');
    addBranchBtn = document.getElementById('addBranchBtn');

    if (addBranchBtn) addBranchBtn.addEventListener('click', addBranch);
    if (jobForm) {
      jobForm.addEventListener('submit', submitJobPost);

      const jobTitle = document.getElementById('jobTitle');
      const jobCompany = document.getElementById('jobCompany');
      const jobDescription = document.getElementById('jobDescription');

      if (jobTitle) jobTitle.addEventListener('input', updatePreview);
      if (jobCompany) jobCompany.addEventListener('input', updatePreview);
      if (jobDescription) jobDescription.addEventListener('input', updatePreview);
    }
  }

  function addBranch() {
    let branchValue = branchSelect.value;
    if (!branchValue || selectedBranches.includes(branchValue)) return;

    selectedBranches.push(branchValue);
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `
      ${branchValue}
      <input type="hidden" name="eligible_branches" value="${branchValue}">
      <span class="close" data-branch="${branchValue}">&times;</span>
    `;
    branchChipsContainer.appendChild(chip);

    chip.querySelector('.close').addEventListener('click', function () {
      selectedBranches = selectedBranches.filter(b => b !== branchValue);
      branchChipsContainer.removeChild(chip);
      updatePreview();
    });

    branchSelect.value = '';
    updatePreview();
  }

  function updatePreview() {
    previewTitle.textContent = document.getElementById('jobTitle').value || 'Job Title';
    previewCompany.textContent = document.getElementById('jobCompany').value || 'Company Name';
    previewDescription.textContent = document.getElementById('jobDescription').value || 'Job description will appear here...';

    previewBranches.innerHTML = '';
    selectedBranches.forEach(branch => {
      const branchChip = document.createElement('div');
      branchChip.className = 'chip';
      branchChip.textContent = branch;
      previewBranches.appendChild(branchChip);
    });
  }

  async function submitJobPost(e) {
    e.preventDefault();
    if (selectedBranches.length === 0) {
      alert('Please add at least one eligible branch');
      return;
    }

    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

    const jobData = {
      title: document.getElementById('jobTitle').value,
      company: document.getElementById('jobCompany').value,
      description: document.getElementById('jobDescription').value,
      location: document.getElementById('jobLocation').value,
      salary: document.getElementById('jobSalary').value,
      deadline: document.getElementById('jobDeadline').value,
      minCGPA: document.getElementById('jobMinCGPA').value,
      branches: selectedBranches
    };

    try {
      const response = await fetch(getApiUrl('/api/jobs'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) throw new Error('Job creation failed');
      const result = await response.json();

      alert('Job posted successfully!');
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error('Error posting job:', err);
      alert('Failed to post job. Please try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Post Job';
    }
  }
});
