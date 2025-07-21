let poems = JSON.parse(localStorage.getItem("poems")) || [];
// 页面元素
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const pages = document.querySelectorAll(".page");
const navButtons = sidebar.querySelectorAll("nav button");
const themeColorSelect = document.getElementById("themeColor");
let categories = JSON.parse(localStorage.getItem('categories')) || ['唐诗', '宋词', '现代诗', '古风', '散文'];
const cards = document.querySelectorAll(".poem-card");
const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
const categoryModal = document.getElementById('categoryModal');
const closeModalBtn = document.querySelector('.close-modal');
const currentCategories = document.getElementById('currentCategories');
const addCategoryForm = document.getElementById('addCategoryForm');
const newCategoryName = document.getElementById('newCategoryName');
const editPoemModal = document.getElementById("editPoemModal");
const closeEditModal = document.querySelector(".close-edit-modal");
const editPoemForm = document.getElementById("editPoemForm");
const editCategory = document.getElementById("editCategory");
const editPoemId = document.getElementById('editPoemId');
const editLine = document.getElementById('editLine');
const editTitle = document.getElementById('editTitle');
const editAuthor = document.getElementById('editAuthor');
const editFull = document.getElementById('editFull');

// 页面切换
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-page");
    pages.forEach((p) => p.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// 侧栏切换显示隐藏
if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });
}

const colorButtons = document.querySelectorAll(".color-btn");

// 隐藏下拉选择框（可选）
if (themeColorSelect) {
  themeColorSelect.style.display = "none";
}

// 给颜色按钮绑定事件
colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.style.backgroundColor;
    // 转成十六进制颜色
    const hexColor = rgbToHex(color);
    setThemeColor(hexColor);
  });
});

function shadeColor(color, percent) {
  // color 是 '#xxxxxx' 格式，percent 是正负数字（改变亮度）
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR =
    R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

function setThemeColor(color) {
  document.documentElement.style.setProperty("--main-color", color);
  document.documentElement.style.setProperty("--header-bg", color);
  document.documentElement.style.setProperty("--sidebar-bg", color);
  document.documentElement.style.setProperty("--button-bg", color);
  document.documentElement.style.setProperty(
    "--button-hover-bg",
    shadeColor(color, -15),
  );
}

// 辅助函数：把 rgb(52, 152, 219) 转成 #3498db
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result) return "#3498db";
  return (
    "#" +
    result
      .map((x) => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// 新增诗句表单相关
const toggleAddFormBtn = document.getElementById("toggleAddFormBtn");
const addPoemForm = document.getElementById("addPoemForm");
const newCategorySelect = document.getElementById("newCategory");
const poemList = document.getElementById("poemList");
const searchInput = document.getElementById("searchInput");

// 渲染分类选项
function renderCategoryOptions() {
  if (!newCategorySelect) return;
  newCategorySelect.innerHTML = "<option disabled selected>请选择分类</option>";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    newCategorySelect.appendChild(option);
  });
}

// 渲染诗句列表（首页+搜索）
function renderPoems() {
  if (!poemList) return;
  poemList.innerHTML = "";
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = poems.filter(
    (p) =>
      p.line.toLowerCase().includes(keyword) ||
      p.title.toLowerCase().includes(keyword) ||
      p.author.toLowerCase().includes(keyword),
  );
  if (filtered.length === 0) {
    poemList.innerHTML = "<p>没有找到符合条件的诗句。</p>";
    return;
  }
  filtered.forEach((poem) => {
    const index = poems.findIndex((p) => p.id === poem.id);
    const card = createPoemCard(poem, index);
    poemList.appendChild(card);
  });
}

// 渲染分类列表（修改后）
function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  if (!categoryList) return;
  categoryList.innerHTML = "";
  
  // 添加"全部"分类
  const allLi = document.createElement("li");
  allLi.style.listStyle = "none";
  allLi.style.margin = "8px 0";
  allLi.innerHTML = `
    <button style="width:100%;padding:8px;background:var(--button-bg);color:white;border:none;border-radius:4px;cursor:pointer">
      全部 (${poems.length})
    </button>
  `;
  allLi.querySelector("button").addEventListener("click", () => {
    document.querySelector('[data-page="home"]').click();
    searchInput.value = "";
    renderPoems();
  });
  categoryList.appendChild(allLi);
  
  // 添加各个分类
  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.style.listStyle = "none";
    li.style.margin = "8px 0";
    li.innerHTML = `
      <button style="width:100%;padding:8px;background:var(--button-bg);color:white;border:none;border-radius:4px;cursor:pointer">
        ${cat} (${poems.filter((p) => p.category === cat).length})
      </button>
    `;
    li.querySelector("button").addEventListener("click", () => {
      document.querySelector('[data-page="home"]').click();
      searchInput.value = cat;
      renderPoems();
    });
    categoryList.appendChild(li);
  });
}

// 创建诗句卡片，全文点击展开
function createPoemCard(poem, index) {
  const card = document.createElement("div");
  card.className = "poem-card";

  card.innerHTML = `
    <div class="poem-line">${poem.line}</div>
    <div class="poem-title">${poem.title} — ${poem.author}</div>
    <div class="poem-full">${poem.full}</div>
    <div class="poem-actions">
      <button class="edit-btn">✏ 修改</button>
      <button class="delete-btn">🗑 删除</button>
    </div>
  `;

  setTimeout(() => {
    const initialWidth = card.offsetWidth;
    card.style.width = `${initialWidth}px`;
  }, 0);

  // 点击“修改”按钮
  const editBtn = card.querySelector(".edit-btn");
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 防止触发展开全文
    openEditModal(index); 
  });

  // 点击“删除”按钮
  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("确定删除这条诗句吗？")) {
      deletePoem(index);
    }
  });
  // 点击卡片非按钮区域，切换全文展开
  // 动态计算max-height，实现展开收起动画且内容自适应高度
  card.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;
    const full = card.querySelector(".poem-full");
    if (full.classList.contains("expanded")) {
      full.style.maxHeight = "0";
      full.classList.remove("expanded");
    } else {
      full.classList.add("expanded");
      full.style.maxHeight = full.scrollHeight + "px";
    }
  });

  return card;
}

function formatPoem(text) {
  return text.replace(/\n/g, "<br>");
}

// 渲染作者列表
function renderAuthors() {
  const authorList = document.getElementById("authorList");
  if (!authorList) return;
  
  // 收集所有作者并去重
  const authors = [...new Set(poems.map(p => p.author))];
  authorList.innerHTML = "";
  
  authors.forEach(author => {
    const count = poems.filter(p => p.author === author).length;
    const div = document.createElement("div");
    div.className = "author-item";
    div.innerHTML = `
      <h3>${author}</h3>
      <p>作品数量: ${count}</p>
      <button class="view-author-btn" data-author="${author}">查看作品</button>
    `;
    
    // 点击查看作者作品
    div.querySelector(".view-author-btn").addEventListener("click", () => {
      document.querySelector('[data-page="home"]').click();
      searchInput.value = author;
      renderPoems();
    });
    
    authorList.appendChild(div);
  });
}

// 渲染全部诗句列表
function renderAllPoems() {
  const allPoemList = document.getElementById("allPoemList");
  if (!allPoemList) return;
  
  allPoemList.innerHTML = "";
  
  if (poems.length === 0) {
    allPoemList.innerHTML = "<p>暂无诗句</p>";
    return;
  }
  
  poems.forEach(poem => {
    const div = document.createElement("div");
    div.className = "poem-summary";
    div.innerHTML = `
      <h3>${poem.title} - ${poem.author}</h3>
      <p class="poem-line-preview">${poem.line}</p>
      <button class="view-full-btn" data-id="${poem.id}">查看全文</button>
    `;
    
    // 点击查看全文
    div.querySelector(".view-full-btn").addEventListener("click", () => {
      // 找到对应诗句并展开全文
      const poemCard = document.querySelector(`.poem-card[data-id="${poem.id}"]`);
      if (poemCard) {
        document.querySelector('[data-page="home"]').click();
        searchInput.value = poem.line;
        renderPoems();
        
        // 延迟后展开全文
        setTimeout(() => {
          const fullText = poemCard.querySelector(".poem-full");
          fullText.classList.add("expanded");
          fullText.style.maxHeight = fullText.scrollHeight + "px";
        }, 100);
      }
    });
    
    allPoemList.appendChild(div);
  });
}

// 添加诗句表单显示切换
if (toggleAddFormBtn && addPoemForm) {
  toggleAddFormBtn.addEventListener("click", () => {
    addPoemForm.classList.toggle("active");
    
    // 同步修改按钮文字
    if (addPoemForm.classList.contains("active")) {
      toggleAddFormBtn.textContent = "收起表单";
      // 展开时设置内边距
      setTimeout(() => {
        addPoemForm.style.padding = "20px";
      }, 10); // 延迟一点确保过渡效果正常
    } else {
      toggleAddFormBtn.textContent = "添加新诗句";
      // 收起前重置内边距
      addPoemForm.style.padding = "0";
    }
  });
}

// 添加新诗句
if (addPoemForm) {
  addPoemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newLine = document.getElementById("newLine").value.trim();
    const newTitle = document.getElementById("newTitle").value.trim();
    const newAuthor = document.getElementById("newAuthor").value.trim();
    const newCategory = document.getElementById("newCategory").value;
    const newFull = document.getElementById("newFull").value.trim();

    if (!newLine || !newTitle || !newAuthor || !newCategory || !newFull) {
      alert("请填写所有字段！");
      return;
    }

    const newId =
      poems.length > 0 ? Math.max(...poems.map((p) => p.id)) + 1 : 1;
    poems.push({
      id: newId,
      line: newLine,
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      full: newFull,
    });
    localStorage.setItem("poems", JSON.stringify(poems));

    renderPoems();
    addPoemForm.reset();
    addPoemForm.classList.remove("active");
    toggleAddFormBtn.textContent = "添加新诗句";
  });
}

function deletePoem(index) {
  poems.splice(index, 1);
  localStorage.setItem("poems", JSON.stringify(poems));
  renderPoems(); // ✅ 改回你实际使用的渲染函数
}

function openEditModal(index) {
  const poem = poems[index];
  editPoemId.value = poem.id;
  editLine.value = poem.line;
  editTitle.value = poem.title;
  editAuthor.value = poem.author;
  editFull.value = poem.full;
  
  // 只需要调用一次渲染分类选项的函数
  renderEditCategoryOptions(poem.category);
  
  editPoemModal.classList.add('active');
}

// 渲染编辑表单中的分类选项
function renderEditCategoryOptions(poemCategory) {
  if (!editCategory) return;
  editCategory.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    if (cat === poemCategory) {
      option.selected = true;
    }
    editCategory.appendChild(option);
  });
}

closeEditModal.addEventListener('click', () => {
  editPoemModal.classList.remove('active');
});

editPoemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = parseInt(editPoemId.value);
  const index = poems.findIndex(p => p.id === id);
  
  if (index !== -1) {
    poems[index] = {
      ...poems[index],
      line: editLine.value.trim(),
      title: editTitle.value.trim(),
      author: editAuthor.value.trim(),
      category: editCategory.value,
      full: editFull.value.trim()
    };
    
    localStorage.setItem('poems', JSON.stringify(poems));
    renderPoems(); // 重新渲染诗句列表
    editPoemModal.classList.remove('active'); // 关闭弹窗
  }
});

function closeAllModals() {
  if (categoryModal) categoryModal.classList.remove('active');
  if (editPoemModal) editPoemModal.classList.remove('active');
}

function renderCurrentCategories() {
  currentCategories.innerHTML = '';
  categories.forEach((cat, index) => {
    const div = document.createElement('div');
    div.className = 'category-item';
    div.innerHTML = `
      <span>${cat}</span>
      <button class="delete-category" data-index="${index}">删除</button>
    `;
    currentCategories.appendChild(div);
  });

  // 绑定删除分类事件
  document.querySelectorAll('.delete-category').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const catToDelete = categories[index];
      
      // 检查是否有诗句使用该分类
      const hasPoems = poems.some(p => p.category === catToDelete);
      if (hasPoems && !confirm(`该分类下有${poems.filter(p => p.category === catToDelete).length}条诗句，删除后将移至"未分类"，确定删除吗？`)) {
        return;
      }
      
      // 更新诗句分类（移至未分类）
      poems = poems.map(p => 
        p.category === catToDelete ? { ...p, category: '未分类' } : p
      );
      
      // 删除分类
      categories.splice(index, 1);
      localStorage.setItem('categories', JSON.stringify(categories));
      localStorage.setItem('poems', JSON.stringify(poems));
      
      // 重新渲染
      renderCurrentCategories();
      renderCategories();
      renderCategoryOptions();
    });
  });
}

// 添加新分类
addCategoryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newCat = newCategoryName.value.trim();
  
  if (!newCat) {
    alert('请输入分类名称');
    return;
  }
  
  if (categories.includes(newCat)) {
    alert('该分类已存在');
    return;
  }
  
  categories.push(newCat);
  localStorage.setItem('categories', JSON.stringify(categories));
  
  // 重新渲染相关UI
  newCategoryName.value = '';
  renderCurrentCategories();
  renderCategories();
  renderCategoryOptions();
  // 如果编辑模态框打开，也更新其分类选项
  if (editPoemModal.classList.contains('active')) {
    renderEditCategoryOptions(editCategory.value);
  }
});

// 打开分类管理弹窗
manageCategoriesBtn.addEventListener('click', () => {
  categoryModal.classList.add('active');
  renderCurrentCategories(); // 渲染当前分类列表
});

// 关闭分类管理弹窗
closeModalBtn.addEventListener('click', () => {
  categoryModal.classList.remove('active');
});

document.addEventListener('click', (e) => {
  if (e.target === categoryModal) closeAllModals();
  if (e.target === editPoemModal) closeAllModals();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// 搜索监听
if (searchInput) {
  searchInput.addEventListener("input", renderPoems);
}

// 初始化
renderCategoryOptions();
renderPoems();
renderCategories(); // 新增调用
renderAuthors();
renderAllPoems();
