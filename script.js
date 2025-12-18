// State Management
let state = {
  isLoggedIn: false,
  username: '',
  activeTab: 'home',
  tasks: [],
  activeTaskId: null,
  focusSessions: [],
  timer: {
    focusDuration: 25,
    breakDuration: 5,
    totalSessions: 4,
    currentSession: 1,
    isRunning: false,
    isFocusMode: true,
    timeLeft: 25 * 60,
  },
  timerInterval: null,
};

// Initialize app
function init() {
  loadFromLocalStorage();
  setupEventListeners();
  
  if (state.isLoggedIn) {
    showMainApp();
  } else {
    showLoginScreen();
  }
}

// Local Storage
function loadFromLocalStorage() {
  const savedUsername = localStorage.getItem('pomodoro_username');
  const savedTasks = localStorage.getItem('pomodoro_tasks');
  const savedSessions = localStorage.getItem('pomodoro_sessions');
  const savedActiveTask = localStorage.getItem('pomodoro_active_task');

  if (savedUsername) {
    state.username = savedUsername;
    state.isLoggedIn = true;
  }
  if (savedTasks) {
    state.tasks = JSON.parse(savedTasks);
  }
  if (savedSessions) {
    state.focusSessions = JSON.parse(savedSessions);
  }
  if (savedActiveTask) {
    state.activeTaskId = savedActiveTask;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('pomodoro_username', state.username);
  localStorage.setItem('pomodoro_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('pomodoro_sessions', JSON.stringify(state.focusSessions));
  if (state.activeTaskId) {
    localStorage.setItem('pomodoro_active_task', state.activeTaskId);
  } else {
    localStorage.removeItem('pomodoro_active_task');
  }
}

// Event Listeners
function setupEventListeners() {
  // Login
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.currentTarget.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // Timer
  document.getElementById('settingsBtn').addEventListener('click', toggleSettings);
  document.getElementById('applySettings').addEventListener('click', applyTimerSettings);
  document.getElementById('startBtn').addEventListener('click', startTimer);
  document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
  document.getElementById('resetBtn').addEventListener('click', resetTimer);
  
  // Tasks
  document.getElementById('addTaskBtn').addEventListener('click', showTaskForm);
  document.getElementById('cancelTaskBtn').addEventListener('click', hideTaskForm);
  document.getElementById('taskFormElement').addEventListener('submit', handleTaskSubmit);
}

// Screen Management
function showLoginScreen() {
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('mainApp').classList.remove('active');
}

function showMainApp() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  updateUserDisplay();
  updateDashboard();
  renderTasks();
  updateStatistics();
  updateLeaderboard();
}

// Login/Logout
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  if (username) {
    state.username = username;
    state.isLoggedIn = true;
    saveToLocalStorage();
    showMainApp();
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to logout? Your data will be preserved.')) {
    state.isLoggedIn = false;
    showLoginScreen();
  }
}

// User Display
function updateUserDisplay() {
  const initial = state.username.charAt(0).toUpperCase();
  document.getElementById('userInitial').textContent = initial;
  document.getElementById('navUsername').textContent = state.username;
  document.getElementById('profileInitial').textContent = initial;
  document.getElementById('profileUsername').textContent = state.username;
}

// Navigation
function switchTab(tabName) {
  state.activeTab = tabName;
  
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    }
  });
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');
  
  // Update content based on tab
  if (tabName === 'home') {
    updateDashboard();
  } else if (tabName === 'tasks') {
    renderTasks();
  } else if (tabName === 'statistics') {
    updateStatistics();
  } else if (tabName === 'leaderboard') {
    updateLeaderboard();
  }
}

// Dashboard
function updateDashboard() {
  const weeklyMinutes = calculateWeeklyMinutes();
  const focusPoints = weeklyMinutes;
  
  document.getElementById('weeklyTime').textContent = formatTime(weeklyMinutes);
  document.getElementById('focusPoints').textContent = focusPoints;
}

function calculateWeeklyMinutes() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  
  return state.focusSessions.reduce((total, session) => {
    const sessionDate = new Date(session.date);
    if (sessionDate >= weekStart) {
      return total + session.minutes;
    }
    return total;
  }, 0);
}

// Timer Functions
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.classList.toggle('active');
}

function applyTimerSettings() {
  state.timer.focusDuration = parseInt(document.getElementById('focusDuration').value) || 25;
  state.timer.breakDuration = parseInt(document.getElementById('breakDuration').value) || 5;
  state.timer.totalSessions = parseInt(document.getElementById('totalSessions').value) || 4;
  state.timer.timeLeft = state.timer.focusDuration * 60;
  state.timer.isFocusMode = true;
  state.timer.currentSession = 1;
  state.timer.isRunning = false;
  
  updateTimerDisplay();
  updateSessionIndicators();
  toggleSettings();
}

function startTimer() {
  state.timer.isRunning = true;
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('pauseBtn').style.display = 'flex';
  
  state.timerInterval = setInterval(() => {
    state.timer.timeLeft--;
    updateTimerDisplay();
    
    if (state.timer.timeLeft <= 0) {
      handleTimerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  state.timer.isRunning = false;
  document.getElementById('startBtn').style.display = 'flex';
  document.getElementById('pauseBtn').style.display = 'none';
  
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }
}

function resetTimer() {
  pauseTimer();
  state.timer.isFocusMode = true;
  state.timer.currentSession = 1;
  state.timer.timeLeft = state.timer.focusDuration * 60;
  updateTimerDisplay();
  updateSessionIndicators();
}

function handleTimerComplete() {
  pauseTimer();
  
  if (state.timer.isFocusMode) {
    // Focus session completed
    addFocusSession(state.timer.focusDuration);
    
    if (state.timer.currentSession < state.timer.totalSessions) {
      // Switch to break
      state.timer.isFocusMode = false;
      state.timer.timeLeft = state.timer.breakDuration * 60;
    } else {
      // All sessions complete
      state.timer.currentSession = 1;
      state.timer.timeLeft = state.timer.focusDuration * 60;
      alert('All sessions completed! Great work!');
    }
  } else {
    // Break completed
    state.timer.currentSession++;
    state.timer.isFocusMode = true;
    state.timer.timeLeft = state.timer.focusDuration * 60;
  }
  
  updateTimerDisplay();
  updateSessionIndicators();
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timer.timeLeft / 60);
  const seconds = state.timer.timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  document.getElementById('timerDisplay').textContent = timeString;
  document.getElementById('timerMode').textContent = state.timer.isFocusMode ? 'Focus Time' : 'Break Time';
  
  // Update progress ring
  const totalTime = state.timer.isFocusMode ? state.timer.focusDuration * 60 : state.timer.breakDuration * 60;
  const progress = (totalTime - state.timer.timeLeft) / totalTime;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference * (1 - progress);
  
  document.getElementById('progressRing').style.strokeDashoffset = offset;
  
  // Update session counter
  document.getElementById('sessionCounter').textContent = `Session ${state.timer.currentSession} of ${state.timer.totalSessions}`;
  
  // Update active task display
  const activeTask = state.tasks.find(t => t.id === state.activeTaskId);
  if (activeTask && !activeTask.completed) {
    document.getElementById('activeTaskDisplay').style.display = 'block';
    document.getElementById('activeTaskName').textContent = activeTask.title;
  } else {
    document.getElementById('activeTaskDisplay').style.display = 'none';
  }
}

function updateSessionIndicators() {
  const container = document.getElementById('sessionIndicators');
  container.innerHTML = '';
  
  for (let i = 1; i <= state.timer.totalSessions; i++) {
    const dot = document.createElement('div');
    dot.className = 'session-dot';
    
    if (i < state.timer.currentSession) {
      dot.classList.add('completed');
    } else if (i === state.timer.currentSession) {
      dot.classList.add('active');
    }
    
    container.appendChild(dot);
  }
}

function addFocusSession(minutes) {
  const today = new Date().toISOString().split('T')[0];
  state.focusSessions.push({ date: today, minutes });
  
  // Update active task
  if (state.activeTaskId) {
    const task = state.tasks.find(t => t.id === state.activeTaskId);
    if (task) {
      task.focusMinutes += minutes;
    }
  }
  
  saveToLocalStorage();
  updateDashboard();
}

// Task Management
function showTaskForm() {
  document.getElementById('taskForm').classList.add('active');
  document.getElementById('formTitle').textContent = 'New Task';
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
}

function hideTaskForm() {
  document.getElementById('taskForm').classList.remove('active');
}

function handleTaskSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  
  if (title) {
    const task = {
      id: Date.now().toString(),
      title,
      description,
      focusMinutes: 0,
      completed: false,
    };
    
    state.tasks.push(task);
    saveToLocalStorage();
    renderTasks();
    hideTaskForm();
  }
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.activeTaskId === id) {
    state.activeTaskId = null;
  }
  saveToLocalStorage();
  renderTasks();
}

function toggleTaskComplete(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    if (task.completed && state.activeTaskId === id) {
      state.activeTaskId = null;
    }
    saveToLocalStorage();
    renderTasks();
  }
}

function setActiveTask(id) {
  state.activeTaskId = state.activeTaskId === id ? null : id;
  saveToLocalStorage();
  renderTasks();
  updateTimerDisplay();
}

function renderTasks() {
  const container = document.getElementById('tasksList');
  
  if (state.tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-tasks">
        <div class="empty-icon">🎯</div>
        <p>No tasks yet</p>
        <p>Create your first task to start tracking your focus time</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = state.tasks.map(task => {
    const isActive = state.activeTaskId === task.id;
    return `
      <div class="task-item ${isActive ? 'active-task' : ''} ${task.completed ? 'completed' : ''}">
        <div class="task-content-wrapper">
          <button class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTaskComplete('${task.id}')">
            ${task.completed ? '✓' : ''}
          </button>
          
          <div class="task-info">
            <h3 class="task-title ${task.completed ? 'completed' : ''}">${task.title}</h3>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            <div class="task-meta">
              <div class="task-focus-time">
                <div class="focus-dot"></div>
                <span>Focus time:</span>
                <span>${formatTime(task.focusMinutes)}</span>
              </div>
              ${isActive ? '<span class="task-badge">Active</span>' : ''}
            </div>
          </div>
          
          <div class="task-actions">
            ${!task.completed ? `
              <button class="action-btn ${isActive ? 'active-btn' : ''}" onclick="setActiveTask('${task.id}')" title="${isActive ? 'Deactivate' : 'Set as active'}">
                🎯
              </button>
            ` : ''}
            <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Statistics
function updateStatistics() {
  const weeklyData = getWeeklyData();
  const totalWeeklyMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);
  const averageDaily = Math.round(totalWeeklyMinutes / 7);
  const completedTasks = state.tasks.filter(t => t.completed).length;
  
  document.getElementById('statTotalTime').textContent = formatTime(totalWeeklyMinutes);
  document.getElementById('statAverage').textContent = formatTime(averageDaily);
  document.getElementById('statCompleted').textContent = completedTasks;
  
  renderChart(weeklyData);
  renderInsights(weeklyData, totalWeeklyMinutes, averageDaily);
}

function getWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = days.map(day => ({ day, minutes: 0 }));
  
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  
  state.focusSessions.forEach(session => {
    const sessionDate = new Date(session.date);
    const daysDiff = Math.floor((sessionDate - weekStart) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff < 7) {
      weekData[daysDiff].minutes += session.minutes;
    }
  });
  
  return weekData;
}

function renderChart(weeklyData) {
  const container = document.getElementById('chartContainer');
  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 1);
  const barWidth = 60;
  const barGap = 20;
  const chartWidth = (barWidth + barGap) * 7;
  const chartHeight = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  
  let svg = `
    <svg class="chart-svg" viewBox="0 0 ${chartWidth + padding.left + padding.right} ${chartHeight + padding.top + padding.bottom}">
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4f9cf9" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#9f7aea" stop-opacity="0.3" />
        </linearGradient>
      </defs>
  `;
  
  // Draw bars and labels
  weeklyData.forEach((data, index) => {
    const x = padding.left + index * (barWidth + barGap);
    const barHeight = (data.minutes / maxMinutes) * (chartHeight - padding.bottom);
    const y = chartHeight - barHeight;
    
    svg += `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
        fill="url(#barGradient)" rx="8" />
      <text x="${x + barWidth / 2}" y="${chartHeight + 20}" 
        fill="#9ca3af" font-size="12" text-anchor="middle">${data.day}</text>
    `;
  });
  
  // Y-axis labels
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxMinutes / 5) * i);
    const y = chartHeight - (chartHeight - padding.bottom) * (i / 5);
    svg += `
      <text x="${padding.left - 10}" y="${y}" 
        fill="#9ca3af" font-size="11" text-anchor="end">${value}m</text>
      <line x1="${padding.left}" y1="${y}" x2="${chartWidth + padding.left}" y2="${y}" 
        stroke="rgba(255,255,255,0.1)" stroke-dasharray="3,3" />
    `;
  }
  
  svg += '</svg>';
  container.innerHTML = svg;
}

function renderInsights(weeklyData, totalWeeklyMinutes, averageDaily) {
  const container = document.getElementById('insightsContainer');
  const insights = [];
  
  if (totalWeeklyMinutes > 0) {
    const maxDay = weeklyData.reduce((max, day) => day.minutes > max.minutes ? day : max, weeklyData[0]);
    
    if (maxDay.minutes > 0) {
      insights.push(`
        <div class="insight-item blue">
          <div class="insight-dot"></div>
          <p class="insight-text">
            Your most productive day was <span class="insight-highlight">${maxDay.day}</span> 
            with <span class="insight-highlight">${formatTime(maxDay.minutes)}</span>
          </p>
        </div>
      `);
    }
    
    if (totalWeeklyMinutes >= 840) {
      insights.push(`
        <div class="insight-item purple">
          <div class="insight-dot"></div>
          <p class="insight-text">
            Great job! You've achieved over <span class="insight-highlight">14 hours</span> of focus time this week
          </p>
        </div>
      `);
    }
    
    if (averageDaily < 30 && totalWeeklyMinutes > 0) {
      insights.push(`
        <div class="insight-item yellow">
          <div class="insight-dot"></div>
          <p class="insight-text">
            Try to increase your daily focus time to reach your goals
          </p>
        </div>
      `);
    }
  }
  
  if (insights.length > 0) {
    container.innerHTML = `<div class="insight-card">${insights.join('')}</div>`;
  } else {
    container.innerHTML = '';
  }
}

// Leaderboard
function updateLeaderboard() {
  const totalWeeklyMinutes = calculateWeeklyMinutes();
  
  const dummyUsers = [
    { username: 'Sarah Chen', focusMinutes: 1200 },
    { username: 'Mike Johnson', focusMinutes: 980 },
    { username: 'Emma Davis', focusMinutes: 850 },
    { username: 'Alex Kim', focusMinutes: 720 },
    { username: 'Lisa Wang', focusMinutes: 650 },
    { username: state.username, focusMinutes: totalWeeklyMinutes },
  ];
  
  const leaderboard = dummyUsers
    .sort((a, b) => b.focusMinutes - a.focusMinutes)
    .map((user, index) => ({
      ...user,
      focusPoints: user.focusMinutes,
      rank: index + 1,
    }));
  
  renderPodium(leaderboard.slice(0, 3));
  renderLeaderboardTable(leaderboard);
}

function renderPodium(topThree) {
  const container = document.getElementById('podium');
  const podiumOrder = [topThree[1], topThree[0], topThree[2]]; // 2nd, 1st, 3rd
  
  container.innerHTML = podiumOrder.map((user, index) => {
    if (!user) return '';
    
    const rankIcons = ['🥇', '🥈', '🥉'];
    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
    const isCurrentUser = user.username === state.username;
    
    return `
      <div class="podium-item ${rankClasses[user.rank - 1]} ${isCurrentUser ? 'current-user' : ''}">
        <div class="podium-rank-icon">${rankIcons[user.rank - 1]}</div>
        <div class="podium-rank">#${user.rank}</div>
        <div class="podium-avatar">${user.username.charAt(0).toUpperCase()}</div>
        <h3 class="podium-username">${user.username}</h3>
        <p class="podium-time">${formatTime(user.focusMinutes)}</p>
        <p class="podium-points">${user.focusPoints} points</p>
      </div>
    `;
  }).join('');
}

function renderLeaderboardTable(leaderboard) {
  const tbody = document.getElementById('leaderboardBody');
  const rankIcons = ['🥇', '🥈', '🥉'];
  
  tbody.innerHTML = leaderboard.map(user => {
    const isCurrentUser = user.username === state.username;
    const rankIcon = user.rank <= 3 ? rankIcons[user.rank - 1] : '🏆';
    
    return `
      <tr class="${isCurrentUser ? 'current-user' : ''}">
        <td>
          <div class="rank-cell">
            <span class="rank-icon">${rankIcon}</span>
            <span class="rank-number">#${user.rank}</span>
          </div>
        </td>
        <td>
          <div class="user-cell">
            <div class="table-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <div>
              <div class="user-name">${user.username}</div>
              ${isCurrentUser ? '<div class="user-label">You</div>' : ''}
            </div>
          </div>
        </td>
        <td class="time-cell">${formatTime(user.focusMinutes)}</td>
        <td class="points-cell">${user.focusPoints}</td>
      </tr>
    `;
  }).join('');
}

// Utility Functions
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  init();
  updateSessionIndicators();
  updateTimerDisplay();
});
