let poems = JSON.parse(localStorage.getItem("poems")) || [];
// 页面元素
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const pages = document.querySelectorAll(".page");
const navButtons = sidebar.querySelectorAll("nav button");
const themeColorSelect = document.getElementById("themeColor");
const categories = ["唐诗", "宋词", "现代诗", "古风", "散文"];

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

// 渲染分类列表
function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  if (!categoryList) return;
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.style.listStyle = "none";
    li.style.margin = "8px 0";
    li.innerHTML = `
      <button style="width:100%;padding:8px;background:var(--button-bg);color:white;border:none;border-radius:4px;cursor:pointer">
        ${cat} (${poems.filter(p => p.category === cat).length})
      </button>
    `;
    // 点击分类筛选诗句
    li.querySelector("button").addEventListener("click", () => {
      // 切换到首页并筛选
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
    editPoem(index);
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

// 添加诗句表单显示切换
if (toggleAddFormBtn && addPoemForm) {
  toggleAddFormBtn.addEventListener("click", () => {
    if (addPoemForm.style.display === "block") {
      addPoemForm.style.display = "none";
      toggleAddFormBtn.textContent = "添加新诗句";
    } else {
      addPoemForm.style.display = "block";
      toggleAddFormBtn.textContent = "收起表单";
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
    addPoemForm.style.display = "none";
    toggleAddFormBtn.textContent = "添加新诗句";
  });
}

function deletePoem(index) {
  poems.splice(index, 1);
  localStorage.setItem("poems", JSON.stringify(poems));
  renderPoems(); // ✅ 改回你实际使用的渲染函数
}

function editPoem(index) {
  const poem = poems[index];
  const newLine = prompt("修改诗句：", poem.line);
  const newTitle = prompt("修改标题：", poem.title);
  const newAuthor = prompt("修改作者：", poem.author);
  const newFull = prompt("修改全文（可选）：", poem.full);

  if (newLine && newTitle && newAuthor) {
    poems[index] = {
      ...poem,
      line: newLine,
      title: newTitle,
      author: newAuthor,
      full: newFull || poem.full,
    };
    localStorage.setItem("poems", JSON.stringify(poems));
    renderPoems();
  }
}

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
