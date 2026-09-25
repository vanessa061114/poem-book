let poems = [];
let categories = [];

// ==================== 页面元素 ====================

const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const pages = document.querySelectorAll(".page");
const navButtons = sidebar ? sidebar.querySelectorAll("nav button") : [];

const themeColorSelect = document.getElementById("themeColor");
const colorButtons = document.querySelectorAll(".color-btn");

const toggleAddFormBtn = document.getElementById("toggleAddFormBtn");
const addPoemForm = document.getElementById("addPoemForm");
const newCategorySelect = document.getElementById("newCategory");
const poemList = document.getElementById("poemList");
const searchInput = document.getElementById("searchInput");

const manageCategoriesBtn = document.getElementById("manageCategoriesBtn");
const categoryModal = document.getElementById("categoryModal");
const closeModalBtn = document.querySelector(".close-modal");
const currentCategories = document.getElementById("currentCategories");
const addCategoryForm = document.getElementById("addCategoryForm");
const newCategoryName = document.getElementById("newCategoryName");

const editPoemModal = document.getElementById("editPoemModal");
const closeEditModal = document.querySelector(".close-edit-modal");
const editPoemForm = document.getElementById("editPoemForm");
const editCategory = document.getElementById("editCategory");
const editPoemId = document.getElementById("editPoemId");
const editLine = document.getElementById("editLine");
const editTitle = document.getElementById("editTitle");
const editAuthor = document.getElementById("editAuthor");
const editFull = document.getElementById("editFull");

// ==================== 默认分类 ====================

const DEFAULT_CATEGORIES = ["唐诗", "宋词", "现代诗", "古风", "散文"];

// ==================== 页面切换 ====================

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-page");

    pages.forEach((page) => {
      page.classList.remove("active");
    });

    const targetPage = document.getElementById(target);

    if (targetPage) {
      targetPage.classList.add("active");
    }
  });
});

// ==================== 侧边栏 ====================

if (toggleSidebarBtn && sidebar) {
  toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });
}

// ==================== 主题颜色 ====================

if (themeColorSelect) {
  themeColorSelect.style.display = "none";
}

colorButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const color = btn.style.backgroundColor;
    const hexColor = rgbToHex(color);

    setThemeColor(hexColor);

    localStorage.setItem("themeColor", hexColor);

    colorButtons.forEach((button) => {
      button.classList.remove("active");
    });

    btn.classList.add("active");
  });
});

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));

  const RR = R.toString(16).padStart(2, "0");
  const GG = G.toString(16).padStart(2, "0");
  const BB = B.toString(16).padStart(2, "0");

  return `#${RR}${GG}${BB}`;
}

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);

  if (!result) {
    return "#3498db";
  }

  return (
    "#" +
    result
      .slice(0, 3)
      .map((x) => parseInt(x).toString(16).padStart(2, "0"))
      .join("")
  );
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

// ==================== 数据初始化 ====================

function initializeApp() {
  loadPoems();
  loadCategories();
  loadTheme();

  if (searchInput) {
    searchInput.value = "";
  }

  renderCategoryOptions();
  renderPoems();
  renderCategories();
  renderAuthors();
  renderAllPoems();
}

// ==================== 加载诗句 ====================

function loadPoems() {
  try {
    const savedPoems = localStorage.getItem("poems");

    if (savedPoems) {
      const parsedPoems = JSON.parse(savedPoems);

      if (Array.isArray(parsedPoems)) {
        poems = parsedPoems;
      } else {
        poems = [];
      }
    } else {
      poems = [];
    }
  } catch (error) {
    console.error("加载诗句失败：", error);
    poems = [];
  }
}

// ==================== 加载分类 ====================

function loadCategories() {
  try {
    const savedCategories = localStorage.getItem("categories");

    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);

      if (Array.isArray(parsedCategories)) {
        categories = parsedCategories;
      } else {
        categories = [...DEFAULT_CATEGORIES];
      }
    } else {
      categories = [...DEFAULT_CATEGORIES];
    }
  } catch (error) {
    console.error("加载分类失败：", error);
    categories = [...DEFAULT_CATEGORIES];
  }
}

// ==================== 加载主题 ====================

function loadTheme() {
  const savedColor = localStorage.getItem("themeColor");

  if (savedColor) {
    setThemeColor(savedColor);

    colorButtons.forEach((btn) => {
      const btnColor = rgbToHex(btn.style.backgroundColor);

      if (btnColor.toLowerCase() === savedColor.toLowerCase()) {
        btn.classList.add("active");
      }
    });
  } else {
    const firstButton = colorButtons[0];

    if (firstButton) {
      firstButton.classList.add("active");

      const defaultColor = rgbToHex(firstButton.style.backgroundColor);

      setThemeColor(defaultColor);
    }
  }
}

// ==================== 保存数据 ====================

function savePoems() {
  localStorage.setItem("poems", JSON.stringify(poems));
}

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

// ==================== 分类选项 ====================

function renderCategoryOptions() {
  if (!newCategorySelect) return;

  newCategorySelect.innerHTML = "";

  const defaultOption = document.createElement("option");

  defaultOption.value = "";
  defaultOption.textContent = "请选择分类";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  newCategorySelect.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    newCategorySelect.appendChild(option);
  });
}

// ==================== 渲染诗句 ====================

function renderPoems(filterCategory = "") {
  if (!poemList) return;

  poemList.innerHTML = "";

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtered = poems.filter((poem) => {
    const matchesCategory = !filterCategory || poem.category === filterCategory;

    const matchesSearch =
      !keyword ||
      String(poem.line || "")
        .toLowerCase()
        .includes(keyword) ||
      String(poem.title || "")
        .toLowerCase()
        .includes(keyword) ||
      String(poem.author || "")
        .toLowerCase()
        .includes(keyword);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    poemList.innerHTML = "<p>没有找到符合条件的诗句。</p>";
    return;
  }

  filtered.forEach((poem) => {
    const index = poems.findIndex((item) => item.id === poem.id);

    const card = createPoemCard(poem, index);

    poemList.appendChild(card);
  });
}

// ==================== 创建诗句卡片 ====================

function createPoemCard(poem, index) {
  const card = document.createElement("div");

  card.className = "poem-card";
  card.dataset.id = poem.id;

  card.innerHTML = `
    <div class="poem-line">${escapeHTML(poem.line)}</div>

    <div class="poem-title">
      ${escapeHTML(poem.title)}
      — 
      ${escapeHTML(poem.author)}
    </div>

    <div class="poem-full">
      ${escapeHTML(poem.full)}
    </div>

    <div class="poem-actions">
      <button class="edit-btn">✏ 修改</button>
      <button class="delete-btn">🗑 删除</button>
    </div>
  `;

  // 修改
  const editBtn = card.querySelector(".edit-btn");

  if (editBtn) {
    editBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditModal(index);
    });
  }

  // 删除
  const deleteBtn = card.querySelector(".delete-btn");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      if (confirm("确定删除这条诗句吗？")) {
        deletePoem(index);
      }
    });
  }

  // 点击卡片展开全文
  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) {
      return;
    }

    const full = card.querySelector(".poem-full");

    if (!full) return;

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

// ==================== 防止用户输入 HTML ====================

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text == null ? "" : String(text);

  return div.innerHTML;
}

// ==================== 分类列表 ====================

function renderCategories() {
  const categoryList = document.getElementById("categoryList");

  if (!categoryList) return;

  categoryList.innerHTML = "";

  // 全部
  const allLi = document.createElement("li");

  allLi.style.listStyle = "none";
  allLi.style.margin = "8px 0";

  const allButton = document.createElement("button");

  allButton.textContent = `全部 (${poems.length})`;

  allButton.style.width = "100%";

  allLi.appendChild(allButton);

  allButton.addEventListener("click", () => {
    goHome();

    if (searchInput) {
      searchInput.value = "";
    }

    renderPoems();
  });

  categoryList.appendChild(allLi);

  // 各分类
  categories.forEach((category) => {
    const li = document.createElement("li");

    li.style.listStyle = "none";
    li.style.margin = "8px 0";

    const button = document.createElement("button");

    const count = poems.filter((poem) => poem.category === category).length;

    button.textContent = `${category} (${count})`;

    button.style.width = "100%";

    li.appendChild(button);

    button.addEventListener("click", () => {
      goHome();

      if (searchInput) {
        searchInput.value = "";
      }

      renderPoems(category);
    });

    categoryList.appendChild(li);
  });
}

// ==================== 回到首页 ====================

function goHome() {
  const homeButton = document.querySelector('[data-page="home"]');

  if (homeButton) {
    homeButton.click();
  }
}

// ==================== 作者列表 ====================

function renderAuthors() {
  const authorList = document.getElementById("authorList");

  if (!authorList) return;

  authorList.innerHTML = "";

  const authors = [
    ...new Set(poems.map((poem) => poem.author).filter(Boolean)),
  ];

  if (authors.length === 0) {
    authorList.innerHTML = "<p>暂无作者。</p>";
    return;
  }

  authors.forEach((author) => {
    const count = poems.filter((poem) => poem.author === author).length;

    const div = document.createElement("div");

    div.className = "author-item";

    div.innerHTML = `
      <h3>${escapeHTML(author)}</h3>
      <p>作品数量：${count}</p>
      <button class="view-author-btn">
        查看作品
      </button>
    `;

    const viewButton = div.querySelector(".view-author-btn");

    viewButton.addEventListener("click", () => {
      goHome();

      if (searchInput) {
        searchInput.value = author;
      }

      renderPoems();
    });

    authorList.appendChild(div);
  });
}

// ==================== 全部诗句 ====================

function renderAllPoems() {
  const allPoemList = document.getElementById("allPoemList");

  if (!allPoemList) return;

  allPoemList.innerHTML = "";

  if (poems.length === 0) {
    allPoemList.innerHTML = "<p>暂无诗句</p>";
    return;
  }

  poems.forEach((poem) => {
    const div = document.createElement("div");

    div.className = "poem-summary";

    div.innerHTML = `
      <h3>
        ${escapeHTML(poem.title)}
        -
        ${escapeHTML(poem.author)}
      </h3>

      <p class="poem-line-preview">
        ${escapeHTML(poem.line)}
      </p>

      <button class="view-full-btn">
        查看全文
      </button>
    `;

    const viewButton = div.querySelector(".view-full-btn");

    viewButton.addEventListener("click", () => {
      goHome();

      if (searchInput) {
        searchInput.value = "";
      }

      renderPoems();

      setTimeout(() => {
        const card = document.querySelector(`.poem-card[data-id="${poem.id}"]`);

        if (!card) return;

        const full = card.querySelector(".poem-full");

        if (!full) return;

        full.classList.add("expanded");

        full.style.maxHeight = full.scrollHeight + "px";

        card.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    });

    allPoemList.appendChild(div);
  });
}

// ==================== 添加诗句表单 ====================

if (toggleAddFormBtn && addPoemForm) {
  toggleAddFormBtn.addEventListener("click", () => {
    const isActive = addPoemForm.classList.toggle("active");

    if (isActive) {
      toggleAddFormBtn.textContent = "收起表单";
    } else {
      toggleAddFormBtn.textContent = "添加新诗句";
    }
  });
}

if (addPoemForm) {
  addPoemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newLine = document.getElementById("newLine")?.value.trim();

    const newTitle = document.getElementById("newTitle")?.value.trim();

    const newAuthor = document.getElementById("newAuthor")?.value.trim();

    const newCategory = document.getElementById("newCategory")?.value;

    const newFull = document.getElementById("newFull")?.value.trim();

    if (!newLine || !newTitle || !newAuthor || !newCategory || !newFull) {
      alert("请填写所有字段！");
      return;
    }

    const newId =
      poems.length > 0
        ? Math.max(...poems.map((poem) => Number(poem.id) || 0)) + 1
        : 1;

    poems.push({
      id: newId,
      line: newLine,
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      full: newFull,
    });

    savePoems();

    renderPoems();
    renderCategories();
    renderAuthors();
    renderAllPoems();

    addPoemForm.reset();
    addPoemForm.classList.remove("active");

    if (toggleAddFormBtn) {
      toggleAddFormBtn.textContent = "添加新诗句";
    }
  });
}

// ==================== 删除诗句 ====================

function deletePoem(index) {
  if (index < 0 || index >= poems.length) {
    return;
  }

  poems.splice(index, 1);

  savePoems();

  renderPoems();
  renderCategories();
  renderAuthors();
  renderAllPoems();
}

// ==================== 编辑诗句 ====================

function openEditModal(index) {
  const poem = poems[index];

  if (!poem || !editPoemModal) {
    return;
  }

  if (editPoemId) {
    editPoemId.value = poem.id;
  }

  if (editLine) {
    editLine.value = poem.line || "";
  }

  if (editTitle) {
    editTitle.value = poem.title || "";
  }

  if (editAuthor) {
    editAuthor.value = poem.author || "";
  }

  if (editFull) {
    editFull.value = poem.full || "";
  }

  renderEditCategoryOptions(poem.category);

  editPoemModal.classList.add("active");
}

// ==================== 编辑分类 ====================

function renderEditCategoryOptions(poemCategory) {
  if (!editCategory) return;

  editCategory.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    if (category === poemCategory) {
      option.selected = true;
    }

    editCategory.appendChild(option);
  });
}

// ==================== 保存编辑 ====================

if (closeEditModal) {
  closeEditModal.addEventListener("click", () => {
    editPoemModal?.classList.remove("active");
  });
}

if (editPoemForm) {
  editPoemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = parseInt(editPoemId?.value, 10);

    const index = poems.findIndex((poem) => poem.id === id);

    if (index === -1) {
      return;
    }

    const line = editLine?.value.trim();

    const title = editTitle?.value.trim();

    const author = editAuthor?.value.trim();

    const full = editFull?.value.trim();

    if (!line || !title || !author || !full) {
      alert("请填写完整内容！");
      return;
    }

    poems[index] = {
      ...poems[index],
      line,
      title,
      author,
      category: editCategory?.value || "未分类",
      full,
    };

    savePoems();

    renderPoems();
    renderCategories();
    renderAuthors();
    renderAllPoems();

    editPoemModal?.classList.remove("active");
  });
}

// ==================== 分类管理 ====================

function renderCurrentCategories() {
  if (!currentCategories) return;

  currentCategories.innerHTML = "";

  categories.forEach((category, index) => {
    const div = document.createElement("div");

    div.className = "category-item";

    div.innerHTML = `
        <span>${escapeHTML(category)}</span>
        <button
          class="delete-category"
          data-index="${index}"
        >
          删除
        </button>
      `;

    currentCategories.appendChild(div);
  });

  currentCategories.querySelectorAll(".delete-category").forEach((button) => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index, 10);

      deleteCategory(index);
    });
  });
}

// ==================== 删除分类 ====================

function deleteCategory(index) {
  if (index < 0 || index >= categories.length) {
    return;
  }

  const category = categories[index];

  const relatedPoems = poems.filter((poem) => poem.category === category);

  if (relatedPoems.length > 0) {
    const confirmed = confirm(
      `该分类下有 ${relatedPoems.length} 条诗句，删除后将移至“未分类”，确定删除吗？`,
    );

    if (!confirmed) {
      return;
    }

    poems = poems.map((poem) => {
      if (poem.category === category) {
        return {
          ...poem,
          category: "未分类",
        };
      }

      return poem;
    });
  }

  categories.splice(index, 1);

  // 如果删除后还没有“未分类”，
  // 且确实有诗句被移动过去，就加入分类
  if (relatedPoems.length > 0 && !categories.includes("未分类")) {
    categories.push("未分类");
  }

  saveCategories();
  savePoems();

  renderCurrentCategories();
  renderCategories();
  renderCategoryOptions();
  renderAuthors();
  renderAllPoems();

  if (editPoemModal?.classList.contains("active")) {
    renderEditCategoryOptions(editCategory?.value);
  }
}

// ==================== 添加分类 ====================

if (addCategoryForm) {
  addCategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newCategory = newCategoryName?.value.trim();

    if (!newCategory) {
      alert("请输入分类名称");
      return;
    }

    if (categories.includes(newCategory)) {
      alert("该分类已存在");
      return;
    }

    categories.push(newCategory);

    saveCategories();

    if (newCategoryName) {
      newCategoryName.value = "";
    }

    renderCurrentCategories();
    renderCategories();
    renderCategoryOptions();

    if (editPoemModal?.classList.contains("active")) {
      const currentValue = editCategory?.value;

      renderEditCategoryOptions(currentValue);
    }
  });
}

// ==================== 打开分类管理 ====================

if (manageCategoriesBtn) {
  manageCategoriesBtn.addEventListener("click", () => {
    categoryModal?.classList.add("active");

    renderCurrentCategories();
  });
}

// ==================== 关闭分类管理 ====================

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    categoryModal?.classList.remove("active");
  });
}

// ==================== 关闭所有弹窗 ====================

function closeAllModals() {
  categoryModal?.classList.remove("active");

  editPoemModal?.classList.remove("active");
}

// ==================== 点击背景关闭 ====================

document.addEventListener("click", (event) => {
  if (event.target === categoryModal || event.target === editPoemModal) {
    closeAllModals();
  }
});

// ==================== ESC关闭 ====================

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
});

// ==================== 搜索 ====================

if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderPoems();
  });
}

// ==================== 页面加载 ====================

document.addEventListener("DOMContentLoaded", initializeApp);
