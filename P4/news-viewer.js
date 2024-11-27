class NewsViewer extends HTMLElement {
  constructor() {
    super();
    this.apiUrl = 'https://news-foniuhqsba-uc.a.run.app';
  }

  connectedCallback() {
    this.loadArticles();
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const category = event.target.getAttribute('data-category');
        this.loadArticles(category);
      });
    });
  }

  async loadArticles(category = 'World News') {
    try {
      const response = await fetch(`${this.apiUrl}/${category}`);
      if (!response.ok) throw new Error('Error al obtener los artículos');
      
      const articles = await response.json();
      this.renderArticles(articles);
    } catch (error) {
      console.error('Error:', error);
      this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
    }
  }

  renderArticles(articles) {
    const template = document.getElementById('article-template');
    this.innerHTML = ''; // Limpiar contenido existente

    articles.forEach(article => {
      const articleContent = document.importNode(template.content, true);
      articleContent.querySelector('.title').innerHTML = article.headline;
      articleContent.querySelector('.author').innerHTML = article.author;
      articleContent.querySelector('.description').innerHTML = article.body;
      
      const readMoreLink = articleContent.querySelector('.read-more');
      readMoreLink.href = `article.html?id=${article.id}`;
      
      this.appendChild(articleContent);
    });
  }
}

customElements.define('news-viewer', NewsViewer);
