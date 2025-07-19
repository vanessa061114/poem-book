// 数据初始化
let poems = JSON.parse(localStorage.getItem('poems')) || [
  { id:1, line:'床前明月光', title:'静夜思', author:'李白', category:'抒情', full:'床前明月光，疑是地上霜。\n举头望明月，低头思故乡。' }
];
let categories = JSON.parse(localStorage.getItem('categories')) || ['抒情','山水','思乡','爱情'];

// 页面元素
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const pages = document.querySelectorAll('.page');
const navButtons = sidebar.querySelectorAll('nav button');
const themeColorSelect = document.getElementById('themeColor');

// 页面切换
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-page');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// 侧栏切换显示隐藏
toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

// 主题色动态切换
themeColorSelect.addEventListener('change', () => {
  document.documentElement.style.setProperty('--main-color', themeColorSelect.value);
  document.documentElement.style.setProperty('--header-bg', themeColorSelect.value);
  document.documentElement.style.setProperty('--sidebar-bg', themeColorSelect.value);
  document.documentElement.style.setProperty('--button-bg', themeColorSelect.value);
  document.documentElement.style.setProperty('--button-hover-bg', shadeColor(themeColorSelect.value, -15));
});

// 计算颜色阴影（用于按钮悬浮）
function shadeColor(color, percent) {
  let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent;
  let R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#" + (0x1000000 + (Math.round((t-R)*p/100)+R)*0x10000 + (Math.round((t-G)*p/100)+G)*0x100 + (Math.round((t-B)*p/100)+B)).toString(16).slice(1);
}

// 新增诗句表单相关
const toggleAddFormBtn = document.getElementById('toggleAddFormBtn');
const addPoemForm = document.getElementById('addPoemForm');
const newCategorySelect = document.getElementById('newCategory');
const poemList = document.getElementById('poemList');
const searchInput = document.getElementById('searchInput');

// 渲染分类选项
function renderCategoryOptions() {
  newCategorySelect.innerHTML = '<option disabled selected>请选择分类</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    newCategorySelect.appendChild(option);
  });
}

// 渲染诗句列表（首页+搜索）
function renderPoems() {
  poemList.innerHTML = '';
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = poems.filter(p =>
    p.line.toLowerCase().includes(keyword) ||
    p.title.toLowerCase().includes(keyword) ||
    p.author.toLowerCase().includes(keyword)
  );
  if(filtered.length === 0) {
    poemList.innerHTML = '<p>没有找到符合条件的诗句。</p>';
    return;
  }
  filtered.forEach(poem => {
    const card = createPoemCard(poem);
    poemList.appendChild(card);
  });
}

// 创建诗句卡片，全文点击展开
function createPoemCard(poem) {
  const card = document.createElement('div');
  card.className = 'poem-card';
  card.innerHTML = `
    <div class="poem-line">${poem.line}</div>
    <div class="poem-title">${poem.title} — ${poem.author}</div>
    <div class="poem-full" style="display:none;">${poem.full}</div>
  `;
  card.addEventListener('click', () => {
    const full = card.querySelector('.poem-full');
    full.style.display = full.style.display === 'block' ? 'none' : 'block';
  });
  return card;
}

// 添加诗句表单显示切换
toggleAddFormBtn.addEventListener('click', () => {
  if(addPoemForm.style.display === 'block') {
    addPoemForm.style.display = 'none';
    toggleAddFormBtn.textContent = '添加新诗句';
  } else {
    addPoemForm.style.display = 'block';
    toggleAddFormBtn.textContent = '收起表单';
  }
});

// 添加新诗句
addPoemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newLine = document.getElementById('newLine').value.trim();
  const newTitle = document.getElementById('newTitle').value.trim();
  const newAuthor = document.getElementById('newAuthor').value.trim();
  const newCategory = document.getElementById('newCategory').value;
  const newFull = document.getElementById('newFull').value.trim();

  if(!newLine || !newTitle || !newAuthor || !newCategory || !newFull) {
    alert('请填写所有字段！');
    return;
  }

  const newId = poems.length > 0 ? Math.max(...poems.map(p=>p.id)) +1 : 1;
  poems.push({ id: newId, line:newLine, title:newTitle, author:newAuthor, category:newCategory, full:newFull });
  localStorage.setItem('poems', JSON.stringify(poems));

  renderPoems();
  addPoemForm.reset();
  addPoemForm.style.display = 'none';
  toggleAddFormBtn.textContent = '添加新诗句';
});

// 搜索监听
searchInput.addEventListener('input', renderPoems);

// 初始化
renderCategoryOptions();
renderPoems();
