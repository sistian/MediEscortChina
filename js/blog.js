// Blog articles data (hardcoded - trusted content)
const articles = [
  {"id": 1, "cover": "🇰🇷", "title": "Seoul to Shanghai: Why Koreans Choose China for Medical Tourism", "category": "Medical Tourism", "tags": ["Medical Tourism", "Shanghai", "Korea"], "date": "2026-01-15", "summary": "Discover why Korean medical tourists are increasingly choosing Shanghai for advanced treatments, with cost savings of 40-60% compared to Seoul clinics."},
  {"id": 2, "cover": "🇺🇸", "title": "American's $50K China Medical Trip: Full Cost Breakdown", "category": "Cost Guide", "tags": ["Cost Guide", "Budget", "Surgery"], "date": "2026-01-10", "summary": "A detailed cost analysis of a 2-week medical trip from New York to Beijing, including flights, accommodation, treatments, and travel expenses."},
  {"id": 3, "cover": "🇩🇪", "title": "German Precision Meets Chinese Innovation: Berlin-Wuhan Medical Bridge", "category": "Hospital Guide", "tags": ["Hospital Guide", "Wuhan", "Technology"], "date": "2026-01-05", "summary": "How German engineering standards are being applied to Chinese medical facilities, creating a new model for international healthcare cooperation."},
  {"id": 4, "cover": "🇯🇵", "title": "Tokyo to Beijing: Why Japanese Patients Prefer Chinese Hospitals", "category": "Medical Tourism", "tags": ["Medical Tourism", "Beijing", "Japan"], "date": "2025-12-28", "summary": "Japanese patients are increasingly choosing Beijing for advanced treatments, citing shorter wait times and cutting-edge technology."},
  {"id": 5, "cover": "🇬🇧", "title": "London to Guangzhou: A British Family's Dental Tourism Journey", "category": "Dental Tourism", "tags": ["Dental Tourism", "Guangzhou", "Family"], "date": "2025-12-20", "summary": "A complete guide to dental tourism in Guangzhou for UK families, including costs, procedures, and travel logistics."},
  {"id": 6, "cover": "🇦🇺", "title": "Sydney to Chengdu: Australian's TCM Wellness Retreat Experience", "category": "TCM Wellness", "tags": ["TCM Wellness", "Chengdu", "Australia"], "date": "2025-12-15", "summary": "An Australian shares their 30-day traditional Chinese medicine retreat experience in Chengdu, including costs and benefits."},
  {"id": 7, "cover": "🇫🇷", "title": "Paris to Hangzhou: French Beauty Seeker's Complete Cosmetic Guide", "category": "Cosmetic Surgery", "tags": ["Cosmetic Surgery", "Hangzhou", "France"], "date": "2025-12-10", "summary": "A comprehensive guide for French patients seeking cosmetic procedures in Hangzhou, including clinic recommendations and cost comparisons."},
  {"id": 8, "cover": "🇨🇦", "title": "Toronto to Shenzhen: Canadian Tech Worker's Health Screening Trip", "category": "Health Checkup", "tags": ["Health Checkup", "Shenzhen", "Canada"], "date": "2025-12-05", "summary": "A Canadian tech worker's journey to Shenzhen for comprehensive health screening, including costs and what to expect."},
  {"id": 9, "cover": "🇸🇬", "title": "Singapore to Xi'an: Southeast Asian's Silk Road Medical Journey", "category": "Medical Tourism", "tags": ["Medical Tourism", "Xi'an", "Singapore"], "date": "2025-11-28", "summary": "A Singaporean's medical tourism journey to Xi'an, combining healthcare with cultural exploration along the Silk Road."},
  {"id": 10, "cover": "🇧🇷", "title": "Rio to Wuhan: Brazilian Athlete's Sports Medicine Recovery", "category": "Sports Medicine", "tags": ["Sports Medicine", "Wuhan", "Brazil"], "date": "2025-11-20", "summary": "A Brazilian athlete's recovery journey in Wuhan, featuring advanced sports medicine treatments and rehabilitation facilities."},
  {"id": 11, "cover": "🇳🇬", "title": "Nigerian CEO Flies to Shanghai for AI-Powered Cancer Screening", "category": "Cancer Treatment", "tags": ["Cancer Treatment", "Shanghai", "AI"], "date": "2025-11-15", "summary": "A Nigerian CEO's experience with AI-powered cancer screening in Shanghai, including cutting-edge technology and early detection success."},
  {"id": 12, "cover": "🇲🇽", "title": "Mexican Soccer Star's Stem Cell Knee Repair in Beijing", "category": "Sports Medicine", "tags": ["Sports Medicine", "Beijing", "Stem Cell"], "date": "2025-11-10", "summary": "A Mexican soccer player's journey to Beijing for stem cell knee treatment, including recovery timeline and cost breakdown."},
  {"id": 13, "cover": "🇦🇪", "title": "Dubai Billionaire's Anti-Aging Retreat in Shenzhen", "category": "Anti-Aging", "tags": ["Anti-Aging", "Shenzhen", "UAE"], "date": "2025-11-05", "summary": "A Dubai billionaire's month-long anti-aging retreat in Shenzhen, featuring advanced treatments and luxury medical tourism."},
  {"id": 14, "cover": "🇿🇦", "title": "South African Teacher's Weight Loss Surgery in Guangzhou", "category": "Weight Loss", "tags": ["Weight Loss", "Guangzhou", "Surgery"], "date": "2025-10-28", "summary": "A South African teacher's weight loss surgery journey in Guangzhou, including pre-op preparation and post-op care guidance."},
  {"id": 15, "cover": "🇳🇴", "title": "Norwegian Coder's Full Vision Correction in Shanghai", "category": "Eye Surgery", "tags": ["Eye Surgery", "Shanghai", "Technology"], "date": "2025-10-20", "summary": "A Norwegian programmer's complete vision correction experience in Shanghai, featuring the latest LASIK technology and rapid recovery."},
  {"id": 16, "cover": "🇵🇭", "title": "Filipino Mother's IVF Journey in Wuhan: $3,500 vs $15,000", "category": "Fertility Treatment", "tags": ["Fertility Treatment", "Wuhan", "Philippines"], "date": "2025-10-15", "summary": "A Filipino mother's IVF journey in Wuhan, comparing costs and success rates with clinics in Manila and Singapore."},
  {"id": 17, "cover": "🇷🇺", "title": "Russian Engineer's Lung Cancer Immunotherapy in Beijing", "category": "Cancer Treatment", "tags": ["Cancer Treatment", "Beijing", "Immunotherapy"], "date": "2025-10-10", "summary": "A Russian engineer's experience with cutting-edge immunotherapy for lung cancer in Beijing, including treatment protocol and outcomes."},
  {"id": 18, "cover": "🇮🇹", "title": "Italian Model's Skin Transformation in Chengdu", "category": "Cosmetic Surgery", "tags": ["Cosmetic Surgery", "Chengdu", "Italy"], "date": "2025-10-05", "summary": "An Italian model's complete skin transformation journey in Chengdu, featuring advanced dermatology and cosmetic treatments."},
  {"id": 19, "cover": "🇳🇿", "title": "New Zealand Retirees' Complete Health Audit in Hangzhou", "category": "Health Checkup", "tags": ["Health Checkup", "Hangzhou", "New Zealand"], "date": "2025-09-28", "summary": "A retired New Zealand couple's comprehensive health audit experience in Hangzhou, including costs and what to expect."},
  {"id": 20, "cover": "🇮🇩", "title": "Indonesian Bride's IVF Miracle in Wuhan: From Hope to Motherhood", "category": "Fertility Treatment", "tags": ["Fertility Treatment", "Wuhan", "Indonesia"], "date": "2025-09-20", "summary": "An Indonesian bride's emotional IVF journey in Wuhan, sharing her path from hope to successful motherhood."}
];

// Render blog cards using DOM manipulation (no innerHTML)
function renderCards(list) {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  // Clear existing cards
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  list.forEach(function(a) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-action', 'open-article');
    card.setAttribute('data-article-id', a.id);
    card.setAttribute('data-category', a.category);

    // Cover image/emoji
    const cover = document.createElement('div');
    cover.className = 'cover';
    cover.textContent = a.cover;
    card.appendChild(cover);

    // Content area
    const content = document.createElement('div');
    content.className = 'article-content';

    // Tags
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'article-tags';
    a.tags.forEach(function(t) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tagsDiv.appendChild(tag);
    });
    content.appendChild(tagsDiv);

    // Date
    const date = document.createElement('div');
    date.className = 'article-meta';
    date.textContent = a.date;
    content.appendChild(date);

    // Title
    const title = document.createElement('h3');
    title.className = 'article-title';
    title.textContent = a.title;
    content.appendChild(title);

    // Summary
    const summary = document.createElement('p');
    summary.className = 'article-excerpt';
    summary.textContent = a.summary;
    content.appendChild(summary);

    // Read more link
    const readMore = document.createElement('a');
    readMore.className = 'read-more';
    readMore.href = '#';
    readMore.setAttribute('data-action', 'open-article');
    readMore.setAttribute('data-article-id', a.id);
    readMore.textContent = 'Read More →';
    content.appendChild(readMore);

    card.appendChild(content);
    grid.appendChild(card);
  });
}

function filterBlog(cat, btn) {
  const filtered = cat === 'all' ? articles : articles.filter(function(a) {
    return a.tags.includes(cat) || a.category === cat;
  });
  renderCards(filtered);

  // Update active button
  document.querySelectorAll('.blog-filters button').forEach(function(b) {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
}

function openArticle(id) {
  const article = articles.find(function(a) { return a.id === id; });
  if (!article) return;

  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle) modalTitle.textContent = article.title;

  const modalTags = document.getElementById('modalTags');
  if (modalTags) {
    while (modalTags.firstChild) {
      modalTags.removeChild(modalTags.firstChild);
    }
    article.tags.forEach(function(t) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      modalTags.appendChild(tag);
    });
  }

  const modalDate = document.getElementById('modalDate');
  if (modalDate) modalDate.textContent = article.date;

  const modalBody = document.getElementById('modalBody');
  if (modalBody) {
    // Use a temporary range to safely parse HTML (trusted content)
    modalBody.textContent = '';
    const frag = document.createRange().createContextualFragment(article.body || article.summary);
    modalBody.appendChild(frag);
  }

  const modal = document.getElementById('articleModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeArticle(event) {
  if (event && event.target !== document.getElementById('articleModal') && event.target !== document.getElementById('articleModal')) {
    return;
  }
  const modal = document.getElementById('articleModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Render all on load
if (document.getElementById('blogGrid')) {
  renderCards(articles);
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeArticle();
});
