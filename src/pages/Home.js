import Categories from '../cards';

// --------------------------------
//  Define Data Sources
// --------------------------------

let getCategoriesList = async () => {
  return Categories;
};

let Home = {
  render: async () => {
    let categories = await getCategoriesList();
    let view = /*html*/ `
            <section class="section">
                <div class="row">
                    ${categories
                      .map((category) => {
                        return `<div class="col xl4 m6 s12">
                          <a href="#/category/${category.id}">
                            <div class="category-card">
                              <div class="category-card__image waves-effect waves-block waves-light">
                                <img class="activator" src="img/cards/${category.image}">
                              </div>
                              <div class="category-card__line"></div>
                              <div class="category-card__content">
                                <span class="category-card__title activator grey-text text-darken-4">${category.title}</span>
                              </div>
                            </div>
                          </a>
                      </div>`;
                      })
                      .join('\n ')}
                </div>
            </section>
        `;
    return view;
  },
  after_render: async () => {},
};

export default Home;
