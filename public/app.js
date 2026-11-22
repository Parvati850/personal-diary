const API_URL = '/api';
let token = localStorage.getItem('token');
let currentEntryId = null;
let entries = [];

// Mood emoji mapping
const moodEmojis = {
  happy: '😊',
  sad: '😢',
  excited: '🤩',
  anxious: '😰',
  neutral: '😐'
};

// Category emoji mapping
const categoryEmojis = {
  personal: '📝',
  work: '💼',
  travel: '✈️',
  health: '💪',
  goals: '🎯',
  gratitude: '🙏'
};

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const diaryScreen = document.getElementById('diary-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authError = document.getElementById('auth-error');
const entriesContainer = document.getElementById('entries-container');
const emptyState = document.getElementById('empty-state');
const entryView = document.getElementById('entry-view');

if (token) {
  showDiaryScreen();
} else {
  showAuthScreen();
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    if (tab.dataset.tab === 'login') {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
    }
    authError.textContent = '';
  });
});

// Register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      authError.style.color = 'green';
      authError.textContent = 'Registration successful! Please login.';
      document.querySelector('[data-tab="login"]').click();
    } else {
      let msg = 'Registration failed';
      try {
        const data = await res.json();
        msg = data.message || msg;
      } catch {
        msg = await res.text();
      }
      authError.textContent = msg;
      authError.style.color = '#ff4444';
    }
  } catch (err) {
    authError.textContent = 'Registration failed';
    authError.style.color = '#ff4444';
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      const data = await res.json();
      token = data.token;
      localStorage.setItem('token', token);
      showDiaryScreen();
    } else {
      let msg = 'Registration failed';
      try {
        const data = await res.json();
        msg = data.message || msg;
      } catch {
        msg = await res.text();
      }
      authError.textContent = msg;
      authError.style.color = '#ff4444';
    }
  } catch (err) {
    authError.textContent = 'Login failed';
    authError.style.color = '#ff4444';
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  showAuthScreen();
});

// New Entry
document.getElementById('new-entry-btn').addEventListener('click', () => {
  currentEntryId = null;
  document.getElementById('entry-title').value = '';
  document.getElementById('entry-tags').value = '';
  document.getElementById('entry-text').value = '';
  document.getElementById('entry-category').value = 'personal';
  document.getElementById('entry-mood').value = 'neutral';
  document.getElementById('entry-color').value = '#667eea';
  document.getElementById('entry-favorite').checked = false;
  document.getElementById('favorite-toggle').classList.remove('active');
  document.getElementById('entry-date').textContent = '';
  document.getElementById('entry-updated').textContent = '';
  document.getElementById('delete-btn').style.display = 'none';
  
  emptyState.classList.add('hidden');
  entryView.classList.remove('hidden');
  
  document.querySelectorAll('.entry-item').forEach(item => {
    item.classList.remove('active');
  });
});

// Color Presets
document.querySelectorAll('.color-preset').forEach(preset => {
  preset.addEventListener('click', () => {
    const color = preset.dataset.color;
    document.getElementById('entry-color').value = color;
  });
});

// Favorite Toggle
document.getElementById('favorite-toggle').addEventListener('click', function() {
  const checkbox = document.getElementById('entry-favorite');
  checkbox.checked = !checkbox.checked;
  this.classList.toggle('active', checkbox.checked);
});

document.getElementById('entry-favorite').addEventListener('change', function() {
  document.getElementById('favorite-toggle').classList.toggle('active', this.checked);
});

// Save Entry
document.getElementById('save-btn').addEventListener('click', async () => {
  const title = document.getElementById('entry-title').value;
  const tags = document.getElementById('entry-tags').value
    .split(',')
    .map(t => t.trim())
    .filter(t => t);
  const text = document.getElementById('entry-text').value;
  const category = document.getElementById('entry-category').value;
  const mood = document.getElementById('entry-mood').value;
  const color = document.getElementById('entry-color').value;
  const favorite = document.getElementById('entry-favorite').checked;
  
  if (!text) {
    alert('Please write something');
    return;
  }
  
  try {
    if (currentEntryId) {
      // Update
      await fetch(`${API_URL}/entries/${currentEntryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, tags, text, category, mood, color, favorite })
      });
    } else {
      // Create
      await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, tags, text, category, mood, color, favorite })
      });
    }
    
    await loadEntries();
  } catch (err) {
    alert('Failed to save entry');
  }
});

// Delete Entry
document.getElementById('delete-btn').addEventListener('click', async () => {
  if (!currentEntryId || !confirm('Delete this entry?')) return;
  
  try {
    await fetch(`${API_URL}/entries/${currentEntryId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    currentEntryId = null;
    emptyState.classList.remove('hidden');
    entryView.classList.add('hidden');
    await loadEntries();
  } catch (err) {
    alert('Failed to delete entry');
  }
});

// Search & Filter
document.getElementById('search-btn').addEventListener('click', () => {
  loadEntries();
});

document.getElementById('clear-search-btn').addEventListener('click', () => {
  document.getElementById('search-tag').value = '';
  document.getElementById('filter-category').value = '';
  document.getElementById('filter-mood').value = '';
  document.getElementById('search-start').value = '';
  document.getElementById('search-end').value = '';
  document.getElementById('filter-favorites').dataset.active = 'false';
  document.getElementById('filter-favorites').classList.remove('active');
  loadEntries();
});

document.getElementById('filter-favorites').addEventListener('click', function() {
  const isActive = this.dataset.active === 'true';
  this.dataset.active = !isActive;
  this.classList.toggle('active', !isActive);
  loadEntries();
});

// Load Entries
async function loadEntries() {
  const tag = document.getElementById('search-tag').value;
  const category = document.getElementById('filter-category').value;
  const mood = document.getElementById('filter-mood').value;
  const startDate = document.getElementById('search-start').value;
  const endDate = document.getElementById('search-end').value;
  const favoritesOnly = document.getElementById('filter-favorites').dataset.active === 'true';
  
  let url = `${API_URL}/entries?`;
  if (tag) url += `tag=${encodeURIComponent(tag)}&`;
  if (category) url += `category=${category}&`;
  if (mood) url += `mood=${mood}&`;
  if (startDate) url += `startDate=${startDate}&`;
  if (endDate) url += `endDate=${endDate}&`;
  if (favoritesOnly) url += `favorite=true&`;
  
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    entries = await res.json();
    renderEntries();
  } catch (err) {
    console.error('Failed to load entries', err);
  }
}

// Render Entries
function renderEntries() {
  entriesContainer.innerHTML = '';
  
  if (entries.length === 0) {
    entriesContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No entries found</p>';
    return;
  }
  
  entries.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'entry-item';
    if (entry._id === currentEntryId) div.classList.add('active');
    
    // Apply color theme
    if (!div.classList.contains('active')) {
      div.style.borderLeftColor = entry.color || '#667eea';
    }
    
    const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const moodEmoji = moodEmojis[entry.mood] || '😐';
    const categoryEmoji = categoryEmojis[entry.category] || '📝';
    const favoriteIcon = entry.favorite ? '<span class="favorite-icon">⭐</span>' : '';
    
    div.innerHTML = `
      <h4>
        ${favoriteIcon}
        <span class="mood-emoji">${moodEmoji}</span>
        ${entry.title || 'Untitled'}
      </h4>
      <div class="date">${date}</div>
      <div class="category-badge">${categoryEmoji} ${entry.category}</div>
      ${entry.tags && entry.tags.length ? `
        <div class="tags">
          ${entry.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
      ` : ''}
    `;
    
    div.addEventListener('click', () => loadEntry(entry._id));
    entriesContainer.appendChild(div);
  });
}

// Load Single Entry
async function loadEntry(id) {
  try {
    const res = await fetch(`${API_URL}/entries/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const entry = await res.json();
    currentEntryId = id;
    
    document.getElementById('entry-title').value = entry.title || '';
    document.getElementById('entry-tags').value = entry.tags ? entry.tags.join(', ') : '';
    document.getElementById('entry-text').value = entry.text || '';
    document.getElementById('entry-category').value = entry.category || 'personal';
    document.getElementById('entry-mood').value = entry.mood || 'neutral';
    document.getElementById('entry-color').value = entry.color || '#667eea';
    document.getElementById('entry-favorite').checked = entry.favorite || false;
    document.getElementById('favorite-toggle').classList.toggle('active', entry.favorite);
    
    const createdDate = new Date(entry.createdAt).toLocaleString();
    document.getElementById('entry-date').textContent = `Created: ${createdDate}`;
    
    if (entry.updatedAt && entry.updatedAt !== entry.createdAt) {
      const updatedDate = new Date(entry.updatedAt).toLocaleString();
      document.getElementById('entry-updated').textContent = `Updated: ${updatedDate}`;
    } else {
      document.getElementById('entry-updated').textContent = '';
    }
    
    document.getElementById('delete-btn').style.display = 'block';
    
    emptyState.classList.add('hidden');
    entryView.classList.remove('hidden');
    
    renderEntries();
  } catch (err) {
    alert('Failed to load entry');
  }
}

// Screen Management
function showAuthScreen() {
  authScreen.classList.remove('hidden');
  diaryScreen.classList.add('hidden');
}

function showDiaryScreen() {
  authScreen.classList.add('hidden');
  diaryScreen.classList.remove('hidden');
  loadEntries();
}
